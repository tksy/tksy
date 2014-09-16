var gotoLoginPage = function() {
	location.replace("../login/");
};
(function() {
	$(document).on("click", "#signout-button", function(){
		usersMilkCocoa.logout();
		console.log("ログアウトしました");
		gotoLoginPage();
	});
})();

window.onload = function() {
	usersMilkCocoa.getCurrentUser(function(err, user) {
		console.log("err", err);
		console.log("user", user);
		if (err === null) {
			$("#user-name").text(user.option.name);
			$("#user-email").text(user.email);
			var usersDS = gamesMilkCocoa.dataStore("users").child(user.id);
			usersDS.query({game : "dig77"}).done(function(data) {
				var playCount = 0;
				var highScore = 0;
				if (data.length > 0) {
					if (data[0].playCount) {
						playCount = data[0].playCount;
					}
					if (data[0].highScore) {
						highScore = data[0].highScore;
					}
				}
				$("#dig77-playCount").text(playCount);
				$("#dig77-highScore").text(highScore);
			});

		} else {
			gotoLoginPage();
		}
	});
};

