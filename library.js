
var $ = require('jquery') // (window); <--- surprised this appears to be unnecessary based on StackOverflow articles.
var Promise = require('es6-promise').Promise;

var errorMessageFromjqXHR = function(jqXHR_, textStatus_, errorThrown_) {
    return "HTTP error " + jqXHR_.status + ". " + jqXHR_.statusText + ": " + jqXHR_.responseText;
}

var requestUrl = function (baseUrl_, routeSuffix_) {
    var baseUrl = (baseUrl_ != null) && baseUrl_ || ".";
    var slashTerminated = baseUrl_.indexOf('/', baseUrl_.length - 1) !== -1;

    return baseUrl + (!slashTerminated && "/" || "") + routeSuffix_;
}

var createAjaxRequestPromise = function(httpMethod_, relativeUrl_, dataObject_) {
    return new Promise( function(resolve_, reject_) {
        $.ajax({
            type: httpMethod_,
            url: relativeUrl_,
            cache: false,
            data: dataObject_,
            dataType: "json", // This is the expected return type
            success: function(data_) {
                resolve_(data_);
            },
            error: function(jqXHR_, textStatus_, errorThrown_) {
                reject_(new Error(errorMessageFromjqXHR(jqXHR_, textStatus_, errorThrown_)));
            }
        });
    });
}

// GET /meta
module.exports.getMeta = function(baseUrl_) {
    return createAjaxRequestPromise("GET", requestUrl(baseUrl_, "meta"));
}

// GET /models
module.exports.getModels = function(baseUrl_) {
     return createAjaxRequestPromise("GET", requestUrl(baseUrl_, "models"));
}

// GET /stores
module.exports.getStores = function(baseUrl_) {
    return createAjaxRequestPromise("GET", requestUrl(baseUrl_, "stores"));
}

// GET /addresses/:store?/:address?
module.exports.getAddresses = function(baseUrl_, storeUuid_, addressHash_) {
    return createAjaxRequestPromise("GET", requestUrl(baseUrl_, "addresses"), { store: storeUuid_, address: addressHash_ });
}

// GET /data/:store?/:address?
module.exports.getData = function(baseUrl_, storeUuid_, addressHash_) {
    return createAjaxRequestPromise("GET", requestUrl(baseUrl_, "data"), { store: storeUuid_, address: addressHash_});
}

// POST /create/store
module.exports.createStore = function(baseUrl_, modelName_) {
    return createAjaxRequestPromise("POST", requestUrl(baseUrl_, "create/store"), { model: modelName_ });
}

// POST /create/component
module.exports.createComponent = function(baseUrl_, storeUuid_, addressHash_) {
    return createAjaxRequestPromise("POST", requestUrl(baseUrl_, "create/component"), { store: storeUuid_, address: addressHash_ });
}

// POST /update/component
module.exports.updateComponent = function(baseUrl_, storeUuid_, addressHash_, componentData_) {
    return createAjaxRequestPromise("POST", requestUrl(baseUrl_, "update/component"), { store: storeUuid_, address: addressHash_, data: componentData_ });
}

// DELETE /remove/stores
module.exports.removeStores = function(baseUrl_) {
    return createAjaxRequestPromise("DELETE", requestUrl(baseUrl_, "remove/stores"));
}

// DELETE /remove/store
module.exports.removeStore = function(baseUrl_, storeUuid_) {
    return createAjaxRequestPromise("DELETE", requestUrl(baseUrl_, "remove/store"), { store: storeUuid_ });
}

// DELETE /remove/component
module.exports.removeComponent = function(baseUrl_, storeUuid_, addressHash_) {
    return createAjaxRequestPromise("DELETE", requestUrl(baseUrl_, "remove/component"), { store: storeUuid_, address: addressHash_ });
}

