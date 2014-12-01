define([
	'core',
	// plugin
	'music/plugin/activity',
	'music/plugin/open-more',
	// plugin
	'music/controller/playlist-index',
	'music/controller/playlist-detail',
	'music/controller/song-detail',
	'music/controller/song-index'
],function(core){
	
	core.sidebar.configs.set('music',{
 		icon: 'icon-sidebar-music',
 		label: 'Music',
 		url: '#music_playlists',
 	});
});
