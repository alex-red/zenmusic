var ApiReady, deb, debug, handleVidClick, renderVids, resetSR, resetSearch, searchError, searchResponse, searchYt;

debug = true;

deb = function(s) {
  if (debug) {
    return console.log("DEBUG ----> " + s);
  }
};

ApiReady = function() {
  deb('Loaded API');
  gapi.client.setApiKey('AIzaSyAngQLuWEimoRzJnNDOaaI8Ip6NJHEmj_0');
  gapi.client.load('youtube', 'v3', function() {
    deb('Loaded YouTube V3');
    return searchYt('');
  });
};

resetSR = function() {
  window.SR = [];
  SR.results = [];
  SR.nextToken = [];
  SR.prevToken = [];
  SR.curPage = 1;
  return SR.query = "";
};

resetSearch = function() {
  $("#searchOutput").empty();
  SR.results = [];
};

searchError = function(error) {
  switch (error) {
    case 'firstPage':
      return deb('Error, on first page of search');
  }
};

searchYt = function(queryStr, opt) {
  var request, token;
  if (opt == null) {
    opt = false;
  }
  deb("Beginning search of " + queryStr);
  token = "";
  switch (opt) {
    case "next":
      token = SR.nextToken;
      SR.curPage += 1;
      break;
    case "prev":
      token = SR.prevToken;
      if (SR.curPage === 1) {
        searchError('firstPage');
        return;
      }
      SR.curPage -= 1;
      break;
    default:
      resetSR();
  }
  request = gapi.client.youtube.search.list({
    q: queryStr,
    part: 'snippet',
    videoCategoryId: '10',
    type: 'video',
    pageToken: token,
    order: 'viewCount',
    maxResults: 7
  });
  request.execute(searchResponse);
};

searchResponse = function(response) {
  var dbmsg, description, error, id, key, keyObjs, thumbs, title, vid, _i, _len;
  console.log(response);
  resetSearch();
  try {
    keyObjs = response.items;
    for (_i = 0, _len = keyObjs.length; _i < _len; _i++) {
      key = keyObjs[_i];
      title = key.snippet.title;
      description = key.snippet.description;
      thumbs = key.snippet.thumbnails;
      id = key.id.videoId;
      vid = {
        'title': title,
        'description': description,
        'id': id,
        'thumbs': thumbs
      };
      SR.results.push(vid);
    }
    dbmsg = SR.results;
    deb("Current SR: " + dbmsg);
    renderVids();
    SR.nextToken = response.nextPageToken;
    if ('prevPageToken' in response) {
      SR.prevToken = response.prevPageToken;
    }
  } catch (_error) {
    error = _error;
    console.log(error);
    deb('No results found.');
  }
};

renderVids = function() {
  var linkHandle, newDesc, newDiv, newThumb, newTitle, newWrap, overlay, vid, _i, _len, _ref;
  _ref = SR.results;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    vid = _ref[_i];
    newDiv = $('<div/>', {
      'class': 'videoDiv'
    });
    newWrap = $('<div/>', {
      'class': 'videoTextWrapper'
    });
    newTitle = $('<b/>', {
      'class': 'text-info videoTitle'
    });
    newDesc = $('<div/>', {
      'class': 'videoDescription',
      html: vid.description
    });
    newThumb = $("<div/>", {
      'class': 'videoOverlayWrap',
      'html': "<img src='" + vid.thumbs.medium.url + "' class='img-rounded videoThumb'></img>"
    });
    overlay = $("<div/>", {
      'class': 'videoOverlay'
    });
    linkHandle = $('<a/>', {
      'href': '#',
      'onclick': "handleVidClick('" + vid.id + "');",
      'text': "" + vid.title
    });
    $(linkHandle).appendTo(newTitle);
    $(overlay).html('<span class="videoOverlayPlus"><a href="#">+</a></span>').appendTo(newThumb);
    $(newTitle).appendTo(newWrap);
    $(newDesc).appendTo(newWrap);
    $(newWrap).appendTo(newDiv);
    $(newThumb).prependTo(newDiv);
    $(newDiv).appendTo("#searchOutput");
  }
  $("#searchPage").text("Page " + SR.curPage);
};

handleVidClick = function(id) {
  deb("Click : load video with ID: " + id);
  return player.loadVideoById("" + id);
};
