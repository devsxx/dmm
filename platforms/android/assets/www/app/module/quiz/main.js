define([
	'core',
	'quiz/plugin/activity',
    'quiz/controller/quiz-index',
    'quiz/controller/quiz-add',
    'quiz/controller/quiz-detail',
    'quiz/controller/quiz-edit'
],function(core){
	
	core.sidebar.configs.set('quiz',{
 		icon: 'icon-sidebar-quiz',
 		label: 'Quizzes',
 		url: '#quizzes'
 	});
});
