var bcrypt = require("bcrypt-nodejs");
var Msg = require("../../models/msg");

module.exports = function(network, chan, cmd, args) {
	if (cmd != "setpass") {
		return;
	}
	var client = this;
	var msg = new Msg({
		type: Msg.Type.ERROR,
		text: "You must specify a new password"
	});
	if (args.length == 1) {
		var password = args[0];
		var salt = bcrypt.genSaltSync(8);
		var hash = bcrypt.hashSync(password, salt);
		msg = new Msg({
			type: Msg.Type.ERROR,
			text: "Failed to update your password :-("
		});
		if (client.setPassword(hash)) {
			msg = new Msg({
				text: "Successfully updated your password :-)"
			});
		}
	}
	var lobby = network.channels[0];
	lobby.messages.push(msg);
	client.emit("msg", {
		chan: lobby.id,
		msg: msg
	});
};
