define([], function () {
	function removeUpperDirs(path) {

		return path.reduce(function(memo, elem) {
			if (elem === '..') {
				return memo.slice(0, memo.length - 1);
			}
			memo.push(elem);
			return memo;
		}, []);
	}

    return function (module) {
        var path = module.uri.split('/'); 
        path.pop();
        return removeUpperDirs(path).join('/');
    };
});