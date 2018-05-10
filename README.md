# OpenID Connect/ODIC sign-on with Qlik Sense

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes only.


### Prerequisites
Environment
NodeJS platform with access to an ADFS 4.0 (Windows Server 2016) instance.

#### Other
```
-ADFS JWT/Oauth2 support configured
-Qlik Sense Virtual Proxy configured for JWT authentication method
-Signing and encryption certificates for your ADFS platform
```

### Installing

No installer yet for this working code example, simply clone/download this repo to your nodejs platform.

Start instance of node with node security.js
App will default to listen on tcp 3000

## Team

* **Ameer Hakme** - *Initial work* - [Axis Group](https://www.axisgroup.com/managed-services)
* **Sam Gonell** - *Initial work* - [Axis Group](https://www.axisgroup.com/managed-services)
* **Tony Rosa** - *Maintainer* - [Axis Group](https://www.axisgroup.com/managed-services)

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details


<a name="Axis"></a>

## Axis : <code>object</code>
Axis namespace.

**Kind**: global namespace  

* [Axis](#Axis) : <code>object</code>
    * [.Security](#Axis.Security)
        * [.name](#Axis.Security.name) : <code>string</code>
        * [.version](#Axis.Security.version) : <code>string</code>
        * [.debug](#Axis.Security.debug) : <code>boolean</code>
        * [.passport](#Axis.Security.passport) : <code>object</code>
        * [.host](#Axis.Security.host) : <code>string</code>
        * [.port](#Axis.Security.port) : <code>number</code>
        * [.strategy](#Axis.Security.strategy) : <code>object</code>
        * [.authorizationURL](#Axis.Security.authorizationURL) : <code>string</code>
        * [.tokenURL](#Axis.Security.tokenURL) : <code>string</code>
        * [.clientID](#Axis.Security.clientID) : <code>string</code>
        * [.qsHost](#Axis.Security.qsHost) : <code>string</code>
        * [.qsPrefix](#Axis.Security.qsPrefix) : <code>string</code>
        * [.xrfkey](#Axis.Security.xrfkey) : <code>string</code>
        * [.authorize([token])](#Axis.Security.authorize) ⇒ <code>Promise</code>
        * [.setup([attributes])](#Axis.Security.setup) ⇒ <code>Promise</code>
        * [.listen()](#Axis.Security.listen) ⇒ <code>object</code>

<a name="Axis.Security"></a>

### Axis.Security
<p>
The Axis.Security is a singleton class that leverage an ADFS portal and JWT to authenticate users.
Once authenticated, a qlik sense session is stablished and the user is redirected to the qlik sense portal.
</p>


* [.Security](#Axis.Security)
    * [.name](#Axis.Security.name) : <code>string</code>
    * [.version](#Axis.Security.version) : <code>string</code>
    * [.debug](#Axis.Security.debug) : <code>boolean</code>
    * [.passport](#Axis.Security.passport) : <code>object</code>
    * [.host](#Axis.Security.host) : <code>string</code>
    * [.port](#Axis.Security.port) : <code>number</code>
    * [.strategy](#Axis.Security.strategy) : <code>object</code>
    * [.authorizationURL](#Axis.Security.authorizationURL) : <code>string</code>
    * [.tokenURL](#Axis.Security.tokenURL) : <code>string</code>
    * [.clientID](#Axis.Security.clientID) : <code>string</code>
    * [.qsHost](#Axis.Security.qsHost) : <code>string</code>
    * [.qsPrefix](#Axis.Security.qsPrefix) : <code>string</code>
    * [.xrfkey](#Axis.Security.xrfkey) : <code>string</code>
    * [.authorize([token])](#Axis.Security.authorize) ⇒ <code>Promise</code>
    * [.setup([attributes])](#Axis.Security.setup) ⇒ <code>Promise</code>
    * [.listen()](#Axis.Security.listen) ⇒ <code>object</code>

<a name="Axis.Security.name"></a>

#### .Security.name : <code>string</code>
The client API name.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.version"></a>

#### .Security.version : <code>string</code>
The client API version.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.debug"></a>

#### .Security.debug : <code>boolean</code>
Indicates whether the instance runs in debug mode.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.passport"></a>

#### .Security.passport : <code>object</code>
An instance of the passport class.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.host"></a>

#### .Security.host : <code>string</code>
The listening host.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.port"></a>

#### .Security.port : <code>number</code>
The listening port.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.strategy"></a>

#### .Security.strategy : <code>object</code>
An instance of the strategy class.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.authorizationURL"></a>

#### .Security.authorizationURL : <code>string</code>
The uri adfs authorization endpoint.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.tokenURL"></a>

#### .Security.tokenURL : <code>string</code>
The uri adfs token endpoint.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.clientID"></a>

#### .Security.clientID : <code>string</code>
The qlik sense client identifier.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.qsHost"></a>

#### .Security.qsHost : <code>string</code>
The qlik sense host.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.qsPrefix"></a>

#### .Security.qsPrefix : <code>string</code>
The qlik sense uri prefix.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.xrfkey"></a>

#### .Security.xrfkey : <code>string</code>
A header pass to qlik sense during the authentication process.

**Kind**: static property of [<code>.Security</code>](#Axis.Security)  
<a name="Axis.Security.authorize"></a>

#### .Security.authorize([token]) ⇒ <code>Promise</code>
This method is used to request authorization to a qlik sense server. Internal use.

**Kind**: static method of [<code>.Security</code>](#Axis.Security)  
**Returns**: <code>Promise</code> - an instance of a promise.  

| Param | Type | Description |
| --- | --- | --- |
| [token] | <code>string</code> | the security token. |

<a name="Axis.Security.setup"></a>

#### .Security.setup([attributes]) ⇒ <code>Promise</code>
Use this method to initialize the security attributes/properties used during client requests.

**Kind**: static method of [<code>.Security</code>](#Axis.Security)  
**Returns**: <code>Promise</code> - the current instance.  

| Param | Type | Description |
| --- | --- | --- |
| [attributes] | <code>object</code> | an object containing key/value pair used to set the Axis.Security object initial attributes/properties values. |

<a name="Axis.Security.listen"></a>

#### .Security.listen() ⇒ <code>object</code>
Use this method to begin listening for client requests.

**Kind**: static method of [<code>.Security</code>](#Axis.Security)  
**Returns**: <code>object</code> - the current instance.  
