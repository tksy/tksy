var milkcocoa = new MilkCocoa("https://io-rhz6m3s7h.mlkcca.com/");
var dataStore = milkcocoa.dataStore("dig77");
var cellTime = {};
var user = {bombMode : false, life : 3, gold : 100, bomb : 0};
(function() {
	$("#board>tbody>tr>td").each(function(){
		cellTime[$(this).attr("id")] = "";
	});
	$(document).on("click", "#board>tbody>tr>td", function(){
		dig(this);
	});
	$(document).on("click", "#itemBomb", function(){
		toggleBombMode();
	});
	dataStore.on("push", function(data) {
		$cellObj = $("#" + data.value.cell);
		if (cellTime[data.value.cell] == data.value.msec) {
			$cellObj.toggleClass("wait", !$cellObj.hasClass("bombMode"));
		} else {
			$cellObj.removeClass("wait").removeClass("bombMode").html("");
		}
		if (data.value.beforeType === "blast") {
			if (data.value.beforeMsec === cellTime[data.value.cell]) {
				$("#message").text("あなたの設置した爆弾が発動し、" + data.value.amount + "のGoldを奪いました");
				$("#overlay").fadeIn("fast");
				setTimeout(function(){$("#overlay").fadeOut("slow");}, 1000);
				user.gold += data.value.amount;
				updateUser();
			}
		}
	});
})();
var dig = function(cellObj) {
	$cellObj = $(cellObj);
	if (user.bombMode) {
		if ($cellObj.hasClass("wait")) {
			dataStore.query({cell : cellObj.id}).done(function(data) {
				data.forEach(function(value) {
					dataStore.remove(value.id);
				});
				var msec = (new Date()).getTime();
				cellTime[cellObj.id] = msec;
				dataStore.push({cell : cellObj.id, msec : msec, item : (6.1/7), beforeType : "", beforeMsec : 0, amount : user.gold});
				$cellObj.removeClass("wait").addClass("bombMode").html("");
				$cellObj.append($("#imgHidden>img.imgBomb").clone());
				user.bomb -= 1;
				toggleBombMode(false);
			});
		}
	} else {
		if (!$cellObj.hasClass("wait") && !$cellObj.hasClass("bombMode")) {
			dataStore.query({cell : cellObj.id}).done(function(data) {
				var amount = 0;
				var result = appraise((data.length > 0) && (data[0].item) ? data[0].item : Math.random());
				switch (result.type) {
				case "Gold":
					$cellObj.append($("#imgHidden>img.imgGold").clone());
					user.gold += result.amount;
					break;
				case "Bomb":
					$cellObj.append($("#imgHidden>img.imgBomb").clone());
					user.bomb += result.amount;
					toggleBombMode(false);
					break;
				case "blast":
					$cellObj.append($("#imgHidden>img.imgBlast").clone());
					if (user.gold <= 100) {
						amount = Math.floor(user.gold /4);
					} else if (user.gold < 400) {
						amount = Math.floor((user.gold - 100)/3) + 25;
					} else {
						amount = Math.floor((user.gold - 400) /2) + 100;
					}
					user.gold -= amount;
					user.life -= result.amount;
					break;
				}
				data.forEach(function(value) {
					dataStore.remove(value.id);
				});
				var msec = (new Date()).getTime();
				cellTime[cellObj.id] = msec;
				dataStore.push({cell : cellObj.id, msec : msec, item : Math.random(), beforeType : result.type, beforeMsec : data[0].msec, amount : amount});
				if (!updateUser()) {
					return;
				}
				$("#message").text(result.message);
				$("#overlay").fadeIn("fast");
				setTimeout(function(){$("#overlay").fadeOut("slow");}, 1000);
			});
		}
	}
};
var appraise = function(item) {
	var itemType = Math.floor(item * 7);
	var amount;
	if (0 <= itemType && itemType <= 3) {
		amount = Math.floor(item * 1000) % 90 + 10;
		return {type : "Gold", amount : amount, message : amount + "のGoldを獲得した！"};
	} else if (itemType === 5) {
		amount = Math.floor(item * 1000) % 3 + 1;
		return {type : "Bomb", amount : amount, message : amount + "個の爆弾を獲得した！"};
	} else if (itemType === 6) {
		return {type : "blast", amount : 1, message : "爆弾が爆発した！！あなたはライフを１失った。"};
	} else {
		return {type : "None", amount : 0, message : "何も見つからなかった。"};
	}
};
var updateUser = function() {
	$("#Life").text(user.life);
	$("#Gold").text(user.gold);
	$("#Bomb").text(user.bomb);
	if (user.life <= 0) {
		$("#message").text("爆弾が爆発した！！ GameOver！");
		$("#overlay").fadeIn();
		return false;
	}
	if (user.bomb > 0) {
		$("#itemBomb").css("visibility", "visible");
		$("#usageBomb").text("爆弾を使用しますか？");
	} else {
		user.bombMode = false;
		$("#itemBomb").css("visibility", "hidden").toggleClass("bombMode", user.bombMode);
		$("#usageBomb").text("");
	}
	return true;
}
var toggleBombMode = function(vMode) {
	updateUser();
	if (user.bomb > 0) {
		user.bombMode = (vMode === true || vMode === false) ? vMode : !user.bombMode;
		$("#itemBomb").toggleClass("bombMode", user.bombMode);
		$("#usageBomb").text(user.bombMode ? "爆弾を配置できます" : "爆弾を使用しますか？");
	}
};
