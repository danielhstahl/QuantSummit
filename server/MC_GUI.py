
# coding: utf-8

# In[ ]:

## Python program for proof of concept on GUI with real-time Monte Carlo simulations ##
## Import packages ##
import scipy.stats as stats
import numpy as np
import matplotlib.pyplot as plt
import numba
from bottle import route, run, template, request




# In[ ]:

#### Header area defining functions and classes ####
## Define compiled function to quickly perform \sum_i scipy.stats.norm.cdf((B@Y)[i,j]+d[i])
## Precompilation gives a 10x-12x speed-up over simple numpy implementation
def sum_cdf_with_numba(B,c,d,s):    
    """For given B,c,d returns compiled function Z => \sum_i c[i]*scipy.stats.norm.cdf((B@Y)[i,j]+d[i])."""
    """Also returns random version of same function with binomial sizes given by s."""
    
    ## Copied from Daniel's implementation of the error function for portfolio analysis GUI
    ## Replace with rvlib because rvlib needed anyway for random case
    @numba.jit(nopython = True)
    def verf(w):
        wrows = w.shape[0]
        ## Constants
        a1 =  0.254829592
        a2 = -0.284496736
        a3 =  1.421413741
        a4 = -1.453152027
        a5 =  1.061405429
        p  =  0.3275911
        
        result = np.zeros(wrows)
        for i in range(wrows):
            x = w[i]
            sign = 2*(x >= 0)-1
            x = np.abs(x)
            t = 1.0/(1.0 + p*x)
            y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * np.exp(-x * x);
            result[i] = sign * y
        return result
    
    @numba.jit(nopython = True)
    def vcdf(x):
        return 0.5 * (1 + verf((x) / (1.4142135623730951)))
    
    @numba.jit(nopython = True)
    def vcalculate(Y):
        (Yrows, Brows) = Y.shape[0], B.shape[0]
        result = np.zeros(Yrows)
        for j in range(Yrows):
            temp = np.zeros(Brows)
            for i in range(Brows):
                temp[i] = B[i,0]*Y[j,0] +B[i,1]*Y[j,1]+d[i]
            temp = vcdf(temp)
            for i in range(Brows):
                result[j] += c[i]*temp[i]
        return result
    
    ## Need rvlib to get rid of python!
    @numba.jit(nopython = False)
    def rvcalculate(Y, size =1):
        (Yrows, Brows) = Y.shape[0], B.shape[0]
        result = np.zeros(Yrows*size).reshape(Yrows,size)
        for j in range(Yrows):
            temp = np.zeros(Brows)
            for i in range(Brows):
                temp[i] = B[i,0]*Y[j,0] +B[i,1]*Y[j,1]+d[i]
            temp = vcdf(temp)
            temp = stats.binom.rvs(n=s,p = temp, size= [size,s.shape[0]])
            for k in range(size):
                for i in range(Brows):
                    result[j,k] += c[i]/s[i]*temp[k,i]
        return result
    
    return vcalculate, rvcalculate
    


# In[ ]:

## Define position class ##
class Position:
    def __init__(self, product, subProduct, exposure, pd, poolSize):
        self.product = product
        self.subProduct = subProduct
        self.exposure = exposure
        self.pd = pd
        self.poolSize = poolSize
        if product == 'Retail':
            self.rho = .10
        else:
            self.rho = np.sqrt(0.12*(1-np.exp(-50*(pd)))/(1-np.exp(-50))+0.24*(1-(1-np.exp(-50*(pd)))/(1-np.exp(-50))))


# In[ ]:

## Define Book class ##
class Book:
    """The Book class is implemented assuming that positions do not change often. Book class computations will not be efficient when changing positions because method reinit is slow"""
    def __init__(self, book):
        self.book = book
        self.reinit()
    
    def reinit(self):
        self.pdVector = np.array([p.pd for p in self.book])
        self.exposureVector = np.array([p.exposure for p in self.book])
        self.rhoVector = np.array([p.rho for p in self.book])
        self.poolSizeVector = np.array([p.poolSize for p in self.book])
        self.thresholdVector = stats.norm.ppf(self.pdVector)
        self.totalExposure = sum(self.exposureVector)
     
        self.linearMatrix = np.array([[(p.product == 'Retail')*-np.sqrt(p.rho)/np.sqrt(1-p.rho),
                              (p.product == 'Wholesale')*-np.sqrt(p.rho)/np.sqrt(1-p.rho)] for p in self.book])
        self.offsetMatrix = np.array([stats.norm.ppf(p.pd)/np.sqrt(1-p.rho) for p in self.book])
        
        self.compiled_cdf_calc, self.compiled_rcdf_calc = sum_cdf_with_numba(self.linearMatrix, self.exposureVector, self.offsetMatrix, self.poolSizeVector)
        
    def cond_expected_loss(self, z):
        """z should be N x 2 with columns corresponding to retail and wholesale"""
        return self.compiled_cdf_calc(z)
    
    def cond_expected_loss_rate(self,z):
        return self.cond_expected_loss(z)/self.totalExposure
    
    def cond_random_loss(self, z, size = 1):
        condRLVector = self.compiled_rcdf_calc(z, size = size)
        return condRLVector
    
    def cond_random_loss_rate(self, z, size = 1):
        condRLrate = self.cond_random_loss(z, size = size)/self.totalExposure
        return condRLrate


# In[ ]:

#### User-static execution area ####
N = 30000
EAD = 20*10**3 ## In millions
PRODUCTS = {'Retail':['Credit Card', 'Mortgage', 'Consumer'], 'Wholesale':['CRE', 'CI']}
PRODUCT_TOP_DISTRIBUTION = [.7,.3]
PRODUCT_SUB_CONDITIONAL_DISTRIBUTION = [np.array([.15,.6,.25]), np.array([.6,.4])]
PD_DISTRIBUTION = {0.0036:.1235,0.0058:.3704,0.0091:.2469,.0138:.1235,.0208:.0864,.0288:.0494}
POOL_SIZES = {'Retail': 100, 'Wholesale' : 1}
SYSTEMIC_CORRELATION = .7


# In[ ]:

## Generate a generic portfolio ##
## Randomly create positions
def generatePositions():
    ## Import global variables
    global N
    global PRODUCTS
    global AVERAGE_DISTRIBUTION
    
    ## Reserve space for output
    book = []
    
    productDistribution = np.concatenate([PRODUCT_TOP_DISTRIBUTION[i]*PRODUCT_SUB_CONDITIONAL_DISTRIBUTION[i] for i in [0,1]]).ravel()
    productDistributionLabels = np.concatenate(list(PRODUCTS.values())).ravel()
    productPDDistribution =np.meshgrid(list(PD_DISTRIBUTION.values()), productDistribution)
    multinomialParameter = np.concatenate(productPDDistribution[0]*productPDDistribution[1]).ravel()
    subProductTotals = np.random.multinomial(EAD, productDistribution, size = 1)
    subProductNumbers = np.random.multinomial(N, productDistribution, size = 1);
    subProductRollups= {v:{'Records': subProductNumbers[0][i], 'EAD': subProductTotals[0][i]} for i,v in enumerate(productDistributionLabels)}

    ## Loop over products and subproducts
    for topName in PRODUCTS:
        for subProduct in PRODUCTS[topName]:
            subProductData = subProductRollups[subProduct]
            n = subProductData['Records']
            e = subProductData['EAD']
            randomExposure = np.random.multinomial(e*1000, [1/n]*n, size = 1)[0] ## In thousands
            randomPD = np.random.choice(list(PD_DISTRIBUTION.keys()),n,list(PD_DISTRIBUTION.values()))

            ## Create one obligor for each product
            for i, v in enumerate(randomExposure):
                book.append(Position(topName, subProduct, v/1000,randomPD[i],POOL_SIZES[topName]))
    return book

positionsBook = Book(generatePositions())


# In[ ]:

## Create static contour graph backdrop ##
sysRetail = np.arange(-5,-1.5,.1)
sysWholesale = np.arange(-2.5,1,.1)
z = np.array([[v,w] for w in sysWholesale for v in sysRetail])
losses = np.reshape(np.array(positionsBook.cond_expected_loss_rate(z)), [sysRetail.size, sysWholesale.size])
X,Y = np.meshgrid(sysRetail, sysWholesale)
#contourGraph=np.array([X, Y, losses])
#contourGraph=[[l,w, h] for (l,w, h) in zip(X, Y, losses)] #zip(X, Y, losses)#
#print(contourGraph)
#zip(X, Y, losses)

# In[ ]:

##positionsBook.poolSizeVector
##positionsBook.cond_random_loss_rate(np.array([[-1,1], [-2,-2]]), size = 6)
positionsBook.cond_random_loss_rate(stats.multivariate_normal.rvs(mean = [-1,-1], size  =2), size = 1)


# In[ ]:


# In[ ]:

## Create graph that allows user to generte scenarios near selected point and inspect resulting CDF
def importance_sample(selectedPoint, sigma = 1, size = 100):
    global SYSTEMIC_CORRELATION, positionsBook
    mu = [selectedPoint['Retail'], selectedPoint['Wholesale']]
    covNull = np.array([[1,SYSTEMIC_CORRELATION],[SYSTEMIC_CORRELATION, 1]])
    cov = sigma**2*covNull
    
    randomPoints = stats.multivariate_normal.rvs(mean = mu, cov = cov, size = size)
    weights = stats.multivariate_normal.pdf(randomPoints, mean = [0,0], cov= covNull)/stats.multivariate_normal.pdf(randomPoints, mean = mu, cov = cov)
    weights = weights/weights.sum()
    randomlosses = np.transpose(positionsBook.cond_random_loss_rate(randomPoints,size = 1))[0]
    out  = [[l,w] for (l,w) in sorted(zip(randomlosses, weights))]
    return randomPoints, out


@route('/getcontour')
def contour():
    #global contourGraph
    return {'X':X.tolist(),'Y':Y.tolist(), 'losses':losses.tolist()}
    #return {'contour':contourGraph}

@route('/conditional')
def conditional():
    global sysRetail, sysWholesale
    histSize, histBins = 100, 10;
    my_dict=request.query.decode()
    if my_dict.xdata and my_dict.ydata:
        selectedPoint = {'Retail': my_dict.xdata, 'Wholesale': my_dict.ydata}    
    else:
        selectedPoint = {'Retail': sysRetail.mean(), 'Wholesale': sysWholesale.mean()}
    selectedPointNP = np.array([[selectedPoint['Retail'], selectedPoint['Wholesale']]]);
    return {'conditional':positionsBook.cond_random_loss_rate(selectedPointNP, size = histSize)[0].tolist()}

@route('/user_importance_sampling')
def user_importance_sampling():
    global sysRetail, sysWholesale
    sigma = .5
    my_dict=request.query.decode()
    if my_dict.xdata and my_dict.ydata:
        selectedPoint = {'Retail': my_dict.xdata, 'Wholesale': my_dict.ydata}    
    else:
        selectedPoint = {'Retail': sysRetail.mean(), 'Wholesale': sysWholesale.mean()}
    rpoints, rlosses = importance_sample(selectedPoint, sigma = sigma) 
    return {'cdf': rlosses, 'points':rpoints.tolist()}

run(host='localhost', port=8080)

