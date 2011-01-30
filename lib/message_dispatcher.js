/*
 * Copyright 2010-2011 Alexandre Zani (Alexandre.Zani@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function Message(msg, callback, outer_callback) {
  this.type = msg.request.type;
  this.msg = JSON.stringify(msg);
  this.callback = callback;
  this.outer_callback = outer_callback;
}

function MessageDispatcher(url) {
  this.masterCallback = function() {
    if(this.readyState != 4) {
      return;
    }

    this.dispatcher.current_msg.callback(this, this.dispatcher.current_msg);
    this.dispatcher.current_msg = null;
    this.dispatcher.nextInQueue();
  }

  this.nextInQueue = function() {
    if(this.current_msg != null) {
      throw "XhrNotReady";
    }

    if(this.msg_queue.length <= 0) {
      return;
    }

    this.current_msg = this.msg_queue.shift();

    console.log(this.current_msg.msg);
    this.xhr.open(this.method, this.url, true);
    this.xhr.send(this.current_msg.msg);
  }

  this.sendMessage = function(msg) {
    this.msg_queue.push(msg);
    if(this.current_msg == null) {
      this.nextInQueue();
    }
  }

  this.method = "POST";
  this.url = url;
  this.xhr = new XMLHttpRequest();
  this.xhr.onreadystatechange = this.masterCallback;
  this.xhr.dispatcher = this;

  this.msg_queue = new Array();

  this.current_msg = null;
}

