## jQuery-audio
This is an audio player that you can use easily and at high speed. You can even bubble your audio link for the user to download and then play.

## Demo
[See demos](https://github.com/salarizadi/jquery-audio/blob/main/demo)

### Optional import
  - [click to view](https://github.com/salarizadi/jquery-blob) : If you want to use the ability to convert audio link to Blob, you must add this plugin to your project

### 1. Add element
```html
<div class="audio my-audio"></div>
```

### 2. Initialization
```js
$(".my-audio").Audio({
   audio      : `audio link`,
   blob       : true, // false
   timeupdate : function ( time ) {
       console.log("Updated time audio ", this, time)
   },
   success : function () {
       console.log("The audio is loaded", this)
   },
   error   : function ( err ) {
       console.error("The audio is aborted", this, err)
   },
   play    : function () {
       console.log("The audio is playing", this)
   },
   pause   : function () {
       console.log("The audio is paused", this)
   },
   ended   : function () {
       console.log("The audio is ended", this)
   }
})
```
