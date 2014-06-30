function SkinSelector(){}

vehicleLastSkin = {}

function changeMatFile(vehicleDir, skinName) {	
	var code = 'function getSkinsFiles(%vehicleDir, %skinDir) { if ( isFile( %vehicleDir @ "skins/materials_def.cs" ) ) { pathCopy( %vehicleDir @ "skins/materials_def.cs", %vehicleDir @ "materials.cs", false ); } else { return "nope"; } if ( endsWith( %skinDir, "/Default" ) ) { return "default"; } %str = ""; %fileReader = new FileObject(); %fileReader.openForRead( %vehicleDir @ "materials.cs" ); while ( !%fileReader.isEOF() ) { %tmp = %str; %line = %fileReader.readLine(); %str = %tmp NL %line; } %fileReader.close(); for( %file = findFirstFile( %skinDir @ "/*.dds" ); %file !$= ""; %file = findNextFile() ) { %filename = strreplace( %file, %skinDir @ "/", "" ); %str = strreplace( %str, %vehicleDir @ %filename, %file ); } %fileReader = new FileObject(); %fileReader.openForWrite(%vehicleDir @ "materials.cs"); %fileReader.writeLine(%str); %fileReader.close(); return "done"; }'; // replacing in materials.cs
	executeGameEngineCode( code );
	//console.log(vehicleDir +"skins/" +skinName);
	var skinDir = vehicleDir +"skins/" +skinName;
	callGameEngineFuncCallback('getSkinsFiles("' +vehicleDir +'", "' +skinDir +'")', function(result) {
		//console.log('skins=' +result);
		callGameEngineFunc('beamNGReloadCurrentVehicle();');
		$('.SkinSelector').parent().parent().hide( 'slow' );
	});			
}

function selectSkin(skinName) {
	callLuaFuncCallback('v.vehicleDirectory', function(vDir) {		
		var materialsFile = vDir +'materials.cs';
		var defaultMaterialsFile = vDir +'skins/materials_def.cs';
		//console.log('matFile=' +materialsFile);
		//console.log('backMatFile=' +defaultMaterialsFile);
		callGameEngineFuncCallback('isFile("' +defaultMaterialsFile +'")', function(res) {
			//console.log('res=' +res);
			if (res == 0) {
				callGameEngineFuncCallback('pathCopy("' +materialsFile +'", "' +defaultMaterialsFile +'", false)', function(res) {
					console.log('backup done');
				});
			}
			changeMatFile( vDir, skinName );
			vehicleLastSkin[vDir] = skinName;
		});
	});
}

function updSkinsList() {
	$('#skins')
		.find('option')
		.remove();
	callLuaFuncCallback('v.vehicleDirectory', function(vDir) {		
		callGameEngineFuncCallback( 'getDirectoryList("' +vDir +"skins/" +'")', function(arg) {
			$('#skins').append('<option value="Default">Default</option>');
			if ( arg == "" ) {
				return;
			}
			var lastSkin = "";
			if ( vDir in vehicleLastSkin ) {
				lastSkin = vehicleLastSkin[vDir];
			}
			//console.log(arg);
			var skinsArr = arg.split('	');
			$('#skins').append(option);			
			for ( var i = 0; i < skinsArr.length; i++ ) {
				var skin = skinsArr[i];
				var option = $("<option></option>")
					.attr("value", skin)
					.text(skin);
				if ( skin == lastSkin ) {
					option.attr("selected", "1");
				}
				$('#skins').append(option);
			}
		});
	});	
}

SkinSelector.prototype.initialize = function(){
	$('<label>Skin:</label>').appendTo(this.rootElement);	
	$('<select id="skins"></select>').appendTo(this.rootElement);
	$('<button id="selectSkin">Select</button>').appendTo(this.rootElement).click(function(){
		console.log('selectSkin click');
		var selectedSkin = $("#skins option:selected").val();
		selectSkin( selectedSkin );
	});
	$('<button id="hide">Hide</button>').appendTo(this.rootElement).click(function(){
		$('.SkinSelector').parent().parent().hide( 'slow' );
	});
	$( document ).bind( "keydown", function(evt) {
		if ( evt.ctrlKey && evt.keyCode == 83 )
		{
			//console.log('1');
			//console.log($(this).width());
			if ($('.SkinSelector').is(':visible'))
			{
				$('.SkinSelector').parent().parent().hide( 'slow' );
			}
			else
			{
				$('.SkinSelector').parent().parent().show( 'slow' );
				updSkinsList();
			}
		}
	});
		
	console.log("SkinSelector inizialize");
	updSkinsList();	
};

SkinSelector.prototype.update = function(streams) {

}