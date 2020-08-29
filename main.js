var materials;
var blank = {
  id: "new",
  name: "New",
  description: [],
  rarity: "COMMON",
  type: "RESOURCE",
  tags: [],
  food_value: 0,
  material: "PLAYER_SKULL",
  skin_value: "9af8313a2886ed990a3d38171634cc7ba9528bb00d4b53cb0d712b1cb206bd4f",
  protected: false,
  finite: false,
  model: 0
};

window.onbeforeunload = function(e) { //Leave comfirm
  return 'Are you sure you want to leave? You are in the middle of something.';
};

//SELECT A FILE
function showFile(input) {
  let file = input.files[0];
  let reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function() {
      materials = JSON.parse(reader.result);
      for(var i = 0; i < materials.length; i++) {
          addNewItem(materials[i], false); //Add all new items (false as it's not blank)
      }
  };
  reader.onerror = function() {
    console.log(reader.error);
  };
}

//ADD ITEM
function addNewItem(item, isNew) {
  //Elements creation
  var title = document.createElement("p");
  var newItemBox = document.createElement("div");
  var collapsibleBox = document.createElement("div");
  var newEditBox = document.createElement("textarea");
  var skinsLink = document.createElement("a");
  var deleteButton = document.createElement("button");
  var container = document.getElementById("container");

  //Element value setting
  title.appendChild(document.createTextNode(item.name + " ▼"));
  newEditBox.appendChild(document.createTextNode(JSON.stringify(item, null,'\t')));
  skinsLink.appendChild(document.createTextNode("https://minecraft-heads.com/custom-heads/search?searchword=" + item.name.replaceAll(" ", "+")))
  skinsLink.href = "https://minecraft-heads.com/custom-heads/search?searchword=" + item.name.replaceAll(" ", "+");
  skinsLink.setAttribute('target', '_blank');
  deleteButton.appendChild(document.createTextNode("  ❌  "));

  //Element pattern
  newItemBox.appendChild(title);
  newItemBox.appendChild(collapsibleBox);
  collapsibleBox.appendChild(newEditBox);
  container.appendChild(newItemBox);

  //Add Element classes
  title.classList.add("collapsible");
  deleteButton.classList.add("deleteButton");
  collapsibleBox.classList.add("collapsible-content");
  newItemBox.classList.add("row");
  newEditBox.classList.add("editBox");
  newEditBox.classList.add("XL-12");


  //Event listeners
  newEditBox.onkeydown = function(e){ //For TAB in textareas
          if(e.keyCode==9 || e.which==9){
              e.preventDefault();
              var s = this.selectionStart;
              this.value = this.value.substring(0,this.selectionStart) + "\t" + this.value.substring(this.selectionEnd);
              this.selectionEnd = s+1;
          }
      }

  deleteButton.addEventListener("click", function() { //For deleting an item
    var result = confirm('Are you sure you want to\ndelete ' + '"' + item.name + '"?');
    if (result) {
        var element = this.parentElement.parentElement;
        element.remove();
    }
  });

  newEditBox.addEventListener("blur", function() { //For when you end editing a textarea
    auto_grow(this);

    window.onbeforeunload = function(e) {
      return 'Are you sure you want to leave? You are in the middle of something.';
    };

    //Change the head skin and the item name
    try {
      var editedItem = JSON.parse(this.value);
    } catch (e) {
      var error = e.toString().split("line")[1];
      error = error.split("of")[0];
      alert('Unexpected character at line' + error + 'of your item! Does not match JSON format!');
      return;
    }
    var headSides = this.parentElement.getElementsByClassName('customHead');
    if (editedItem != null) {
      var editedTitle = this.parentElement.parentElement.getElementsByTagName("p")[0];
      editedTitle.innerHTML = editedItem.name + " ▼"
      for (var i = 0; i<=11; i++) {
        headSides[i].style.backgroundImage = "url('http://textures.minecraft.net/texture/" + editedItem.skin_value + "')";
      }
    }
  });

  title.addEventListener("click", function() { //Make the textareas collapsible
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
      auto_grow(newEditBox); //Make it big enough to fit all the text
    }
  });

  //HEAD PREVIEW
  var innerCube = document.createElement("div");
  var skin = document.createElement("div");
  skin.classList.add("skin");
  skin.classList.add("spinning");
  innerCube.classList.add("innerCube");

  skin.appendChild(innerCube);

  var sides = ["back","right","top","bottom","front","left","hatBack","hatRight","hatTop","hatBottom","hatFront","hatLeft"];
  for (var i = 0; i<=11; i++) {
    var headSide = document.createElement("div");
    headSide.classList.add("customHead");
    headSide.classList.add(sides[i]);
    headSide.style.backgroundImage = "url('http://textures.minecraft.net/texture/" + item.skin_value + "')";
    innerCube.appendChild(headSide);
  }

  collapsibleBox.appendChild(skin);
  collapsibleBox.appendChild(skinsLink);
  collapsibleBox.appendChild(deleteButton);

  if (isNew) {
    title.click();
    title.scrollIntoView();
    skinsLink.innerHTML = "https://minecraft-heads.com/custom-heads";
    skinsLink.href = "https://minecraft-heads.com/custom-heads";
  }
}

//From Clipboard
function loadFromClipboard() {
  if (document.getElementById("clipboardBox") == null) {
    var textarea = document.createElement("textarea");
    var container = document.getElementById("container");
    textarea.placeholder = "Paste your list here!";

    textarea.classList.add("XL-12");
    textarea.id = "clipboardBox";
    container.appendChild(textarea);

    textarea.addEventListener("input", function() {
      try {
        var items = JSON.parse(this.value);
        this.remove();
        if (items.length == null) {
          addNewItem(items, false);
          return;
        }
        for(var i = 0; i <= items.length; i++) {
          addNewItem(items[i], false);
        }
      } catch (e) {
        this.value = "";
        alert("Clipboard was empty or not a JSON!");
      }
    });
  }
}

//Save
function saveFile() {
  var newList = [];
  var items = document.getElementsByClassName('editBox');
  if (items.length <= 0) {
    alert("Empty list");
    return;
  }
  for (var i = 0; i < items.length; i++) {
    try {
      newList[i] = JSON.parse(items[i].value);
    } catch (e) {
      var error = e.toString().split("line")[1];
      error = error.split("of")[0];
      alert('Unexpected character at line' + error + 'of "' + materials[i].name + '", Item №' + (i+1) +  '. Does not match JSON format!');
      return;
    }
  }
  download(JSON.stringify(materials, null, "\t"), "materials.json", 'text/plain');
  window.onbeforeunload = null;

}

//AUTO GROW
function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

//DOWNLOAD
function download(strData, strFileName, strMimeType) {
var D = document,
    A = arguments,
    a = D.createElement("a"),
    d = A[0],
    n = A[1],
    t = A[2] || "text/plain";
//build download link:
a.href = "data:" + strMimeType + "charset=utf-8," + escape(strData);
if (window.MSBlobBuilder) { // IE10
    var bb = new MSBlobBuilder();
    bb.append(strData);
    return navigator.msSaveBlob(bb, strFileName);
} /* end if(window.MSBlobBuilder) */

if ('download' in a) { //FF20, CH19
    a.setAttribute("download", n);
    a.innerHTML = "downloading...";
    D.body.appendChild(a);
    setTimeout(function() {
        var e = D.createEvent("MouseEvents");
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
        D.body.removeChild(a);
    }, 66);
    return true;
}; /* end if('download' in a) */

//do iframe dataURL download: (older W3)
var f = D.createElement("iframe");
D.body.appendChild(f);
f.src = "data:" + (A[2] ? A[2] : "application/octet-stream") + (window.btoa ? ";base64" : "") + "," + (window.btoa ? window.btoa : escape)(strData);
setTimeout(function() {
    D.body.removeChild(f);
}, 333);
return true;
}


var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
