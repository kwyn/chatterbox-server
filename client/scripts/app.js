// YOUR CODE HERE:
var displayCount = undefined;
var recentRooms = undefined;
var currentRoom = "lobby";
var friends = [];
//----------------------------------------------------------------------------
var currentUsername = function(){
    var chars = window.location.search.split('');
    return chars.slice(chars.indexOf('=')+1).join('');
};
//----------------------------------------------------------------------------
var username = currentUsername();
//----------------------------------------------------------------------------
var changeUsername = function(newName){
  username = newName;
};
//----------------------------------------------------------------------------
var changeRoom = function(roomName){
  currentRoom = ''+roomName;
};
//----------------------------------------------------------------------------
var getRecentRooms = function(){
  $.getJSON("http://127.0.0.1:8080/classes/room1",
   {where: '{"roomname":{"$exists":true}}', order :"-createdAt"},
   function(data){
    messageList = data.results;
      recentRooms = _.reduce(messageList, function(memo, messageObj){
        if( memo.indexOf( messageObj.roomname ) === -1 ){
          memo.push(messageObj.roomname);
        }
        return memo;
      }, ['lobby']);
   });
};
//----------------------------------------------------------------------------

//----------------------------------------------------------------------------
var get = function(){
  var where = '{ "roomname" : "'+ currentRoom +'" }';
  $(".spinner").show();
  $.getJSON("http://127.0.0.1:8080/classes/messages", 
    {order: "-createdAt", where : where},
    display);
};
//----------------------------------------------------------------------------
var display = function(data){
  var messageCount = displayCount || 10;
  var rawMessages = data;
  $(".spinner").hide();
  $(".post").remove();
  _.each(rawMessages , function(rawData){
    var format = '';
    if(friends.indexOf(rawData.username) >= 0){
      format = "<div id= " + rawData.objectId + " class = 'post panel panel-default'> <div class = ' panel-heading' > <span <a class='username friend'> </a> </div> <div class = 'message panel-body'> </div> </div>";
    }else{
      format = "<div id= " + rawData.objectId + " class = 'post panel panel-default'> <div class = 'panel-heading' > <a class='username'> </a> </div> <div class = 'message panel-body'> </div> </div>";
    }
    $("#main .container").append(format);
    $("#"+rawData.objectId +" .username").text(rawData.username + " : ").append("<div class = 'timestamp text-right'> " +moment(rawData.createdAt).fromNow() + "</div>");
    $("#"+rawData.objectId +" .message").text(rawData.text);
  });

  chatRoomDropDown();
  $(".currentUser").text(username);
  $(".currentRoom").text(currentRoom);
};
//----------------------------------------------------------------------------
var send = function(test){
  $.ajax({
    url: 'http://127.0.0.1:8080/classes/messages',
    type: 'POST',
    data: JSON.stringify(test),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      get(currentRoom);
    },
    error: function (data) {
      console.error('chatterbox: Failed to send message');
    }
  });
};

//----------------------------------------------------------------------------
var newMessage = function(text){
  return {
  'username' : username,
  'text' : text,
  'roomname' : currentRoom
  }; 
};
//----------------------------------------------------------------------------

var chatRoomDropDown = function(){
  $(".chatroom-list").empty();
  _.each(recentRooms, function(roomName){
    if(roomName === currentRoom){
      $(".chatroom-list").prepend( '<li class="active"><a href="#" class = "chatroom">'+ roomName +' </a></li> <li class="divider" </li>');
    }else{
      $(".chatroom-list").append( '<li ><a href="#" class = "chatroom">'+ roomName +' </a></li>');
    }
  });
  $(".chatroom-list").append('<li class="divider"> </li> <li class="input-group"> <input type="text" class="form-control createRoom" placeholder = "New Room Name"> </li>');
};
//----------------------------------------------------------------------------
var addFriend = function(newFriend){
  if(friends.indexOf(newFriend) !== -1 && newFriend !== undefined){
    friends.push(newFriend);
  }
};
//----------------------------------------------------------------------------

$(document).ready(function(){
  $('.dropdown-menu').on('click', 'input',function (e) {
    e.stopPropagation();
    e.preventDefault();
    });

  $('.dropdown-menu').on('keydown', '.createRoom', function(e){
    if(e.which === 13){
      console.log(this.value +' created!');
      changeRoom(this.value);
      recentRooms.push(this.value);
    }
  });

  $('.dropdown-menu').on('keydown', '.login', function(e){
     if(e.which === 13){
      changeUsername(this.value);
    }
  });
  $('.dropdown-menu').on('click', '.signout', function(e){
    changeUsername('anonymous');
    });
  //Display current user name
  //submission form
  getRecentRooms();
  $('.message-submit').on('keydown', function(e){
    if(e.which === 13){
      e.preventDefault();
      send(newMessage(this.value));
      this.value = null;
    }
  });

  $('.container').on('click','.username', function(e){
    e.preventDefault();
    console.log(value);
    friends.push(e);
  });

  $('.chatroom-list').on('click','a', function(){
    if(this.text === "Chat-strap"){
      changeRoom('lobby');
    }else{
      changeRoom(this.text);
    }
    $(".spinner").show();
  });

});
//----------------------------------------------------------------------------
get(currentRoom);
setInterval( function(){get(currentRoom);}, 3000);
