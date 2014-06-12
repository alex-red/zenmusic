var onPlayerReady, onYouTubeIframeAPIReady, ytScript;

jQuery(function($) {
  $("#beginBtn").click(function(e) {
    $("#intro").collapse('hide');
    return $("#intro").on('hidden.bs.collapse', function() {
      return $("#contentWrapper").css('padding-top', '48px');
    });
  });
  $("#searchVal").keydown(function(e) {
    if (e.which === 13) {
      return $("#searchBtn").trigger('click');
    }
  });
  $("#searchBtn").click(function(e) {
    var v;
    v = $("#searchVal").val();
    $("#searchVal").val("");
    searchYt(v);
    return SR.query = v;
  });
  $("#searchNext").click(function(e) {
    var v;
    v = SR.query;
    return searchYt(v, 'next');
  });
  $("#searchPrev").click(function(e) {
    var v;
    v = SR.query;
    return searchYt(v, 'prev');
  });
});

window.player = "";

ytScript = $("<script/>", {
  'src': "https://www.youtube.com/iframe_api"
});

$("body").prepend(ytScript);

onYouTubeIframeAPIReady = function() {
  window.player = new YT.Player("ytPlayer", {
    height: "200",
    width: "231",
    videoId: "d0DfyAIkGw0",
    playerVars: {
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      fs: 0
    },
    events: {
      onReady: onPlayerReady
    }
  });
};

onPlayerReady = function(e) {};
