Sections = []
Team = ''


class Platform extends TemplatedView

	load: () ->
		d = @
		d.loading()
		d.team()
		main_folder = '0B7GOD6uQKeU_NWsyeGJWUzF1aGc'
		$.get('/orientation/drive', {folder_url: main_folder}, (data) ->
			for folder in $(data).find('.folder-cell a')
				Sections.push({
					url: $(folder).attr('href').replace('/host/', '')
					title: $(folder).text()
					missions: []
					passwords: []
				})
				break
			d.assets(0, Sections.length-1)
		)

	loading: () ->
		@loading = setInterval( ->
			$('.loading p').typed({
				strings: ['Loading']
				typeSpeed: 10
			})
		, 3000)

	team: () ->
		url_parts = window.location.href.split('/')
		Team = url_parts[url_parts.length-1].toLowerCase()

	assets: (i, last) ->
		d = @
		$.get('/orientation/drive', {folder_url: Sections[i].url}, (data) ->
			for asset in $(data).find('.folder-cell a').slice(1)
				url = $(asset).attr('href').replace('/host/', '')
				file = 'https://googledrive.com/host/'+url
				title = $(asset).text()
				type = title.slice(-3)
				if type == 'pdf' && title.toLowerCase().indexOf('mission') > -1
					Sections[i].missions.push(file)
				else if type == 'txt' && title.toLowerCase().indexOf('password') > -1
					d.password(title, file, i)
			if i is last then new Missions({el: $('main')}).load() else d.assets(i+1, last)
		)

	password: (title, file, i) ->
		$.get('/orientation/password', {url: file}, (data) ->
			Sections[i].passwords.push({title: data})
		)


class Missions extends TemplatedView

	events: {
		'click .mission-tabs li': 'display'
		'keydown .password-container input': 'authenticate'
	}

	templateName: 'missions'

	templateArgs: () ->
		{sections: Sections, team: Team}

	load: () ->
		d = @
		d.render()
		clearInterval(d.loading)
		$('.loading').text('').css('bottom', '100%')
		setTimeout( ->
			$('.loading').css('border-bottom', '0')
		, 600)

	display: (e) ->
		id = $(e.target).data('section')
		$('#'+id).show().siblings().hide()

	authenticate: (e) ->
		d = @
		clearTimeout(d.timer)
		d.timer = setTimeout( ->
			i = $(e.target).data('index')
			password = v for k, v of Sections[i].passwords[0]
			if Sections[i].passwords.length > 1
				for entry in Sections[i].passwords
					password = v if k.toLowerCase().indexOf(Team) > -1 for k, v of entry
			if password.toLowerCase().indexOf($(e.target).val().toLowerCase()) > -1
				$(e.target).parent().hide().siblings().show()
				Materialize.toast('Mission unlocked', 2000)
		, 1000)


new Platform().load()


this.Platform = Platform
this.Missions = Missions
