define([
	'core',
    'blog/controller/blog-add',
    'blog/controller/blog-detail',
    'blog/controller/blog-edit',
	'blog/controller/blog-index',
	'blog/plugin/activity'
],function(core){
	
	core.sidebar.configs.set('blog',{
 		icon: 'icon-sidebar-blog',
 		label: 'Blogs',
 		url: '#blogs'
 	});
});
