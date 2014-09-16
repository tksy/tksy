var gotoUserPage = function() {
	location.replace("../user/");
};
(function() {
	if ($.cookie("signin-email")) {
		$("#signin-email").val($.cookie("signin-email"));
	}
	if ($.cookie("signin-password")) {
		$("#signin-password").val($.cookie("signin-password"));
	}
	$(document).on("click", "#signup-button", function(){
		var name = $("#signup-name").val();
		var email = $("#signup-email").val();
		var password = $("#signup-password").val();
		if (name === "" || email === "" || password === "") {
			alert('未入力の項目があります');
			return;
		}
		usersMilkCocoa.addAccount(email, password, {name : name}, function(err, user) {
			switch (err) {
			case null:
				console.log('正常に登録が完了しました');
				alert('仮登録が完了しました。受信したメールから本登録を行い、ログインして下さい');
				break;
			case MilkCocoa.Error.AddAccount.FormatError:
				console.log('無効な書式のメールアドレスです');
				alert('無効な書式のメールアドレスです');
				break;
			case MilkCocoa.Error.AddAccount.AlreadyExist:
				console.log('既に追加されているメールアドレスです');
				alert('既に追加されているメールアドレスです');
				break;
			default:
				console.log(err);
				console.log(user);
				break;
			}
		});
	});
	$(document).on("click", "#signin-button", function(){
		var email = $("#signin-email").val();
		var password = $("#signin-password").val();
		var rememberme = $("#signin-rememberMe").prop("checked");
		usersMilkCocoa.login(email, password, function(err, user) {
			switch (err) {
			case null:
				console.log('ログイン成功');
				if (rememberme) {
					$.cookie("signin-email", email, {expires: 30});
					$.cookie("signup-password", password, {expires: 30});
				}
				gotoUserPage();
				break;
			case MilkCocoa.Error.Login.FormatError:
				console.log('無効な書式のメールアドレスです');
				alert('無効な書式のメールアドレスです');
				break;
			case MilkCocoa.Error.Login.LoginError:
				console.log('登録されていないEmailか、無効なパスワードです');
				alert('登録されていないEmailか、無効なパスワードです');
				break;
			case MilkCocoa.Error.Login.EmailNotVerificated:
				console.log('まだアカウントは仮登録です');
				alert('まだアカウントは仮登録です');
				break;
			default:
				console.log('err', err);
				console.log('user', user);
				break;
			}
		});
	});
})();

window.onload = function() {
	usersMilkCocoa.getCurrentUser(function(err, user) {
		console.log('err', err);
		console.log('user', user);
		if (err === null) {
			gotoUserPage();
		}
	});
};
