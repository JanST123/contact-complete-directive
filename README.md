# contact-complete-directive
Autocomplete / ContactComplete directive for **[ionic framework](http://ionicframework.com)** on **[angularJS](angularjs.org)**

With this directive you can create an autocomplete box out of each input, getting its data from a callback function (e.g. Cordova contacts plugin). It uses the list from ionic framework (http://ionicframework.com) to display the autocomplete items.

### Usage Example: 
**Template:**
```html
    <input contact-complete contact-complete-callback="onContactSearch" contact-complete-container="contactCompleteContainer" type="text" [...]  />
    <div id="contactCompleteContainer{{$index}}">
       <!-- here the ionic-list will be placed -->
    </div>
```

* The ***contact-complete*** attribute initializes the use of the directive. 
* The ***contact-complete-callback*** attribute is optional and contains an element id of a container where the list should be placed in. If you dont provide this attribute, the autocomplete list will be placed imediately after the input element.

**Contoller (simple example):**
```js
    /**
    * performs a search in the phones contacts on typing in autocomplete
    * @param {String} query - the search query
    * @return {$q} promise
    **/
    $scope.onContactSearch=function(query) {
      return $q(function(resolve, reject) {
        resolve([
          {
            display: query + ' &lt;' + query + '@gmail.com&gt;',
            value: query + ' <' + query + '@gmail.com>'
          },
          {
            display: 'Foo ' + query + ' &lt;foo.' + query + '@gmail.com&gt;',
            value: 'Foo ' + query + ' <foo.' + query + '@gmail.com>'
          },
          {
            display: 'Bar ' + query + ' &lt;bar.' + query + '@gmail.com&gt;',
            value: 'Bar ' + query + ' <bar.' + query + '@gmail.com>'
          }
        ]);
      });
    };
```    
    
***Controller (example using cordova contacts plugin):***
```js
    /**
     * performs a search in the phones contacts on typing in autocomplete
     * @param {String} query - the search query
     * @return {Array} - an array with search results
     **/
    $scope.onContactSearch=function(query) {
      return $q(function(resolve, reject) {
        if (navigator.contacts) {
          // use contacts plugin

          var fields=[navigator.contacts.fieldType.emails, navigator.contacts.fieldType.name];
          var options=new ContactFindOptions();
          options.filter=query;
          options.multiple=true;
          options.desiredFields = [navigator.contacts.fieldType.name, navigator.contacts.fieldType.emails ];

          navigator.contacts.find(fields, function(contacts) {
            // on success
            var ret=[];
            for (var x in contacts) {
              if (typeof(contacts[x])=='object'
                 && contacts[x]!=null
                 && typeof(contacts[x].name)=='object'
                 && contacts[x].name!=null
                 && typeof(contacts[x].name.formatted)!='undefined'
                 && (typeof(contacts[x].emails) == 'object' || typeof(contacts[x].emails) == 'array')
                 && contacts[x].emails!=null
                 && typeof(contacts[x].emails[0]) == 'object'
                 && contacts[x].emails[0]!=null
                 && typeof(contacts[x].emails[0].value)!='undefined') {
                   ret.push({
                     display: contacts[x].name.formatted + ' &lt;' + contacts[x].emails[0].value + '&gt;',
                     value: contacts[x].name.formatted + ' <' + contacts[x].emails[0].value + '>',
                   });
              }
              if (ret.length > 5) break;
            }
            resolve(ret);
          }, function(contactError) {
            // on error (do nothing)
            reject(contactError);
          }, options);
        } else {
          reject('Contacts plugin not loaded');
        }
      });
    }
```


