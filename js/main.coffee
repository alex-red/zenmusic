jQuery ($) ->


	$("#beginBtn").click (e) ->
		$("#intro").collapse('hide')
		$("#intro").on 'hidden.bs.collapse', ->
			$("#contentWrapper").css 'padding-top','48px'
			# h = $("#contentWrapper").css 'height'
			# h = h.replace /px/g, ""
			# deb "setting height to: #{h - 52} from #{h}"
			# $("#contentWrapper").css 'height', "#{+h - 52}"

	$("#searchVal").keydown (e) ->
		if e.which == 13
			$("#searchBtn").trigger 'click'
	$("#searchBtn").click (e) ->
		v = $("#searchVal").val()
		$("#searchVal").val("")
		searchYt v
		SR.query = v
	$("#searchNext").click (e) ->
		v = SR.query
		searchYt v, 'next'
	$("#searchPrev").click (e) ->
		v = SR.query
		searchYt v, 'prev'

	return


# load youtube

window.player = ""

ytScript = $("<script/>",
	'src': "https://www.youtube.com/iframe_api"
	)
$("body").prepend(ytScript)
onYouTubeIframeAPIReady = ->
  window.player = new YT.Player("ytPlayer",
    height: "200"
    width: "231"
    videoId: "d0DfyAIkGw0"
    playerVars:
      modestbranding: 1
      rel: 0
      showinfo: 0
      iv_load_policy: 3
      fs: 0
    events:
      onReady: onPlayerReady
  )
  return

 onPlayerReady = (e) ->
 	return

