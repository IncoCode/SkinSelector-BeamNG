// by Incognito, http://www.beamng.com/threads/8871-Skin-Selector?p=123485&viewfull=1#post123485

function SkinSelector(){}

this.needUpd = true;

SkinSelector.prototype.executeScriptFile = function(fileName) {
	var self = this;

	var filePath = '"./html/' +self.path +fileName + '"';
	executeGameEngineCode( 'exec('+ filePath +');' );
}

SkinSelector.prototype.changeMatFile = function(vehicleDir, skinName) {
	var self = this;
	var skinDir = vehicleDir +"skins/" +skinName;

	self.executeScriptFile( 'getSkinsFilesFunc.cs' );
	callGameEngineFuncCallback('getSkinsFiles("' +vehicleDir +'", "' +skinDir +'", "' +skinName +'")', function(result) {
		callGameEngineFunc('beamNGReloadCurrentVehicle();');
	});
}

SkinSelector.prototype.selectSkin = function(skinName) {
	var self = this;

	callLuaFuncCallback('v.vehicleDirectory', function(vDir) {
		var materialsFile = vDir +'materials.cs';
		var defaultMaterialsFile = vDir +'skins/materials_def.cs';
		callGameEngineFuncCallback('isFile("' +defaultMaterialsFile +'")', function(res) {
			if (res == 0) {
				callGameEngineFuncCallback('pathCopy("' +materialsFile +'", "' +defaultMaterialsFile +'", false)', function(res) {
					console.log('backup done');
				});
			}
			self.changeMatFile( vDir, skinName );
			self.vehicleLastSkin[vDir] = skinName;
		});
	});
}

SkinSelector.prototype.updSkinsList = function() {
	$(this.skinList).empty();
	var self = this;
	console.log('SkinSelector 1');
	setTimeout(function() {
		console.log('SkinSelector 4');
		if ( $(self.skinList).has('option').length === 0 ) {
			console.log('SkinSelector 5');
			self.updSkinsList();
		}
	}, 3000);

	callLuaFuncCallback('v.vehicleDirectory', function(vDir) {
		console.log('SkinSelector 2');
		callGameEngineFuncCallback( 'getDirectoryList("' +vDir +"skins/" +'")', function(arg) {
			console.log('SkinSelector 3');
			$(self.skinList).append('<option value="Default">Default</option>');
			self.needUpd = true;
			if ( arg == "" ) {
				return;
			}
			var lastSkin = "";
			if ( vDir in self.vehicleLastSkin ) {
				lastSkin = self.vehicleLastSkin[vDir];
			}
			var skinsArr = arg.split('	');
			$(self.skinList).append(option);
			for ( var i = 0; i < skinsArr.length; i++ ) {
				var skin = skinsArr[i];
				var option = $("<option></option>")
					.attr("value", skin)
					.text(skin);
				if ( skin == lastSkin ) {
					option.attr("selected", "");
				}
				$(self.skinList).append(option);
			}
		});
	});
}

SkinSelector.prototype.hide = function() {
	$(this.rootElement).hide("slow");
}

SkinSelector.prototype.show = function() {
	$(this.rootElement).show("slow");
}

SkinSelector.prototype.onVehicleReset = function() {
	if ( this.needUpd ) {
		this.needUpd = false;
		this.updSkinsList();
		console.log('1');
	}
}

SkinSelector.prototype.initialize = function(){
	var self = this;
	this.vehicleLastSkin = {};

	this.rootDiv = $('<div class="ssDiv"></div>').appendTo(this.rootElement);
	$('<label>Skin:</label>').appendTo(this.rootDiv);
	this.skinList = $('<select class="ssSelect"></select>').appendTo(this.rootDiv);
	$('<button class="ssBtn">Select</button>').appendTo(this.rootDiv).click(function(){
		var selectedSkin = $(self.skinList).val();
		self.selectSkin( selectedSkin );
	});
	this.updSkinsList();

	console.log("SkinSelector inizialize");
};