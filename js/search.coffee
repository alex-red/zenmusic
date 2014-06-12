debug = true

deb = (s) ->
	if debug
		console.log "DEBUG ----> #{s}"





ApiReady = ->
	deb 'Loaded API'
	gapi.client.setApiKey 'AIzaSyAngQLuWEimoRzJnNDOaaI8Ip6NJHEmj_0'
	gapi.client.load 'youtube', 'v3', ->
		deb 'Loaded YouTube V3'
		# searchYt('katy')
		searchYt ''
	return

resetSR = ->
	# Called when search is reset
	window.SR = []
	SR.results = []
	SR.nextToken = []
	SR.prevToken = []
	SR.curPage = 1
	SR.query = ""

resetSearch = ->
	# Called to empty div and results array
	$("#searchOutput").empty()
	SR.results = []
	return

searchError = (error) ->
	switch error
		when 'firstPage'
			deb 'Error, on first page of search'

searchYt = (queryStr, opt = false) ->
	deb "Beginning search of #{queryStr}"
	token = ""


	switch opt
		when "next"
			token = SR.nextToken
			SR.curPage += 1
		when "prev"
			token = SR.prevToken
			if SR.curPage == 1
				searchError('firstPage')
				return
			SR.curPage -= 1
		else
			resetSR()

	request = gapi.client.youtube.search.list(
			q: queryStr
			part: 'snippet'
			videoCategoryId: '10'
			type: 'video'
			pageToken: token
			order: 'viewCount'
			maxResults: 7
		)
	request.execute searchResponse
	return

searchResponse = (response) ->
	console.log response
	# clear previous searches and div
	resetSearch()
	try
		keyObjs = response.items

		for key in keyObjs
			title = key.snippet.title
			description = key.snippet.description
			# Default, High, medium, {url}
			thumbs = key.snippet.thumbnails
			id = key.id.videoId
			vid =
				'title': title
				'description': description
				'id': id
				'thumbs': thumbs
			SR.results.push vid
		#deb rStr if debug
		dbmsg = SR.results
		deb "Current SR: #{dbmsg}" 

		renderVids()
		#populate next page token
		SR.nextToken = response.nextPageToken
		#get prev token if exist
		if 'prevPageToken' of response
			SR.prevToken = response.prevPageToken
		

	catch error
		console.log(error)
		deb 'No results found.'

	return

renderVids = ->

	for vid in SR.results
		newDiv = $('<div/>',
			'class': 'videoDiv'
			)
		newWrap = $('<div/>',
			'class': 'videoTextWrapper'
				)
		newTitle = $('<b/>',
			'class': 'text-info videoTitle'
			)
		newDesc = $('<div/>',
			'class': 'videoDescription'
			html: vid.description
			)
		newThumb = $("<div/>",
			'class': 'videoOverlayWrap'
			'html': "<img src='#{vid.thumbs.medium.url}' class='img-rounded videoThumb'></img>"
			)
		overlay = $("<div/>",
			'class': 'videoOverlay'
				)
		linkHandle = $('<a/>',
			'href': '#'
			'onclick': "handleVidClick('#{vid.id}');"
			'text': "#{vid.title}"
			)
		$(linkHandle).appendTo newTitle
		$(overlay).html('<span class="videoOverlayPlus"><a href="#">+</a></span>')
			.appendTo newThumb
		$(newTitle).appendTo newWrap
		$(newDesc).appendTo newWrap
		$(newWrap).appendTo newDiv
		$(newThumb).prependTo newDiv
		$(newDiv).appendTo "#searchOutput"

	# Update current page
	$("#searchPage").text("Page #{SR.curPage}")

	return

handleVidClick = (id) ->
	deb "Click : load video with ID: #{id}"
	player.loadVideoById("#{id}")

