socket = io()
Teams = ['charge', 'circuit', 'cloud']
Sections = []


class Platform extends TemplatedView

	events: {
		'click .views li': 'view'
	}

	load: () ->
		d = @
		d.loading()
		mainFolder = 'https://www.dropbox.com/sh/moevgg19xr6vzf3/AAC1g1Bs2rztMIP3TmQu5anxa?dl=0'
		$.get('request', {url: mainFolder}, (data) ->
			for li in $('<div>').html(data).find('#list-view-container li')
				a = $(li).find('.filename a')
				Sections.push({title: $(a).text(), url: $(a).attr('href')})
			d.assets(0, Sections.length-1)
		)

	loading: () ->
		setInterval( ->
			$('.loading p').typed({
				strings: ['Loading']
				typeSpeed: 10
			})
		, 3000)

	assets: (i, last) ->
		d = @
		console.log(Sections)
		$.get('request', {url: Sections[i].url}, (data) ->
			for asset in $(data).find('.folder-cell a').slice(1)
				url = $(asset).attr('href')
				title = $(asset).text()
				type = title.slice(-3)
				thumb = $(li).find('.thumb-link img').attr('src')
				if type == 'pdf' && title.toLowerCase().indexOf('script') > -1
					Sections[i].scripts[0] = file
				else if type == 'pdf' && title.toLowerCase().indexOf('mission') > -1
					Sections[i].scripts.push(file)
				else if type != 'txt'
					Sections[i].slides.push({
						type: type
						url: url
						thumb: thumb
					})
			if i is last then d.setup() else d.assets(i+1, last)
		)

	setup: () ->
		d = @
		new SetupModel().fetch({
			success: (model) ->
				d.model = model
				clearInterval(d.loading)
				$('.loading').text('').css('bottom', '100%')
				setTimeout( ->
					$('.loading').css('border-bottom', '0')
				, 600)
		})

	view: (e) ->
		View = {'presenter': Presenter, 'projector': Projector}
		if @view != $(e.target).data('view')
			@view = $(e.target).data('view')
			$('main').empty().append('<div class="'+@view+'"></div>')
			new View[@view]({el: $('.'+@view), model: @model}).load()
			$('.view-background').css({
				width: $(e.target).width()+20
				left: $(e.target).position().left+10
			})


class Presenter extends TemplatedView

	events: {
		'click .navbar li': 'section'
		'click .script-tabs li': 'script'
		'click .slides li': 'slide'
		'click .rankings #display': 'rankings'
		'change .points input': 'points'
	}

	templateName: 'presenter'

	templateArgs: () ->
		{model: @model, teams: Teams, sections: Sections}

	load: () ->
		@render()
		$('.presenter .rankings input').focus().blur()
		$('.platform').scrollTop(0)
		$('.navbar li')[0].click()

	section: (e) ->
		i = $(e.target).data('section')
		$('#'+i).show().siblings().hide()
		@pdf(i, 0)

	script: (e) ->
		@pdf($(e.target).data('section'), $(e.target).data('script'))

	pdf: (i, j) ->
		src = 'http://docs.google.com/gview?embedded=true&url='+Sections[i].scripts[j]
		$('.script-frame iframe').attr('src', src)

	slide: (e) ->
		slide = $(e.target).parent().data('slide')
		type = $(e.target).parent().data('type')
		socket.emit('orientation-display', {id: slide, type: type})

	rankings: () ->
		socket.emit('orientation-display', {id: 'rankings'})

	points: (e) ->
		points = {}
		for team in Teams.concat(['max_points'])
			points[team] = $('#'+team).val()
		@model.save(points, {
			success: () ->
				Materialize.toast('Points updated.', 3000)
				socket.emit('orientation-rankings', points)
		})


class Projector extends TemplatedView

	templateName: 'projector'

	templateArgs: () ->
		{teams: Teams, sections: Sections}

	load: () ->
		d = @
		d.render()
		socket.on('orientation-display', (data) ->
			d.display(data)
		)
		socket.on('orientation-rankings', (data) ->
			d.rankings(data)
		)
		points = {}
		for team in Teams.concat(['max_points'])
			points[team] = d.model.attributes[team]
		d.rankings(points)

	display: (data) ->
		video.pause() for video in $('video')
		$('.projector #'+data.id).show().siblings().hide()
		if data.type == 'mp4'
			$('.projector #'+data.id+' video')[0].currentTime = 0
			$('.projector #'+data.id+' video')[0].play()

	rankings: (data) ->
		for team in Teams
			width = data[team] / data.max_points * $('#rankings').width()
			$('.ranking[data-team="'+team+'"] .bar').width(width+'px')


class SetupModel extends Backbone.Model

	urlRoot: 'setup'



new Platform({el: $('.platform')}).load()


this.Platform = Platform
this.Presenter = Presenter
this.Projector = Projector
