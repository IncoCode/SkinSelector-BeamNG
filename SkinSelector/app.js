function SkinSelector(){}

function changeMatFile(vehicleDir, skinName) {	
	var code = 'function getSkinsFiles(%vehicleDir, %skinDir) { %i = 0; if ( isFile( %vehicleDir @ "skins/materials_def.cs" ) ) { pathCopy( %vehicleDir @ "skins/materials_def.cs", %vehicleDir @ "materials.cs", false ); } else { return "nope"; } if ( endsWith( %skinDir, "/Default" ) ) { return "default"; } for( %file = findFirstFile( %skinDir @ "/*.dds" ); %file !$= ""; %file = findNextFile() ) { %i++; %str = ""; %filename = strreplace( %file, %skinDir @ "/", "" ); %fileReader = new FileObject(); %fileReader.openForRead( %vehicleDir @ "materials.cs" ); while ( !%fileReader.isEOF() ) { %tmp = %str; %line = %fileReader.readLine(); %str = %tmp NL %line; %text = strreplace( %str, %vehicleDir @ %filename, %file ); %str = %text; } %fileReader.close(); %fileReader = new FileObject(); %fileReader.openForWrite(%vehicleDir @ "materials.cs"); %fileReader.writeLine(%text); %fileReader.close(); } return "done"; }'; // replacing in materials.cs
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
	callLuaFuncCallback('v.vehicleDirectory', function(result) {		
		var materialsFile = result +'materials.cs';
		var defaultMaterialsFile = result +'skins/materials_def.cs';
		//console.log('matFile=' +materialsFile);
		//console.log('backMatFile=' +defaultMaterialsFile);
		callGameEngineFuncCallback('isFile("' +defaultMaterialsFile +'")', function(res) {
			//console.log('res=' +res);
			if (res == 0) {
				callGameEngineFuncCallback('pathCopy("' +materialsFile +'", "' +defaultMaterialsFile +'", false)', function(res) {
					console.log('backup done');
				});
			}
			changeMatFile( result, skinName);
		});
	});
}

function updSkins() {
	$('#skins')
		.find('option')
		.remove();
	callLuaFuncCallback('v.vehicleDirectory', function(result) {		
		callGameEngineFuncCallback( 'getDirectoryList("' +result +"skins/" +'")', function(arg) {
			$('#skins').append('<option value="Default">Default</option>');
			//console.log(arg);
			var skinsArr = arg.split('	');
			$('#skins').append(option);
			for ( var i = 0; i < skinsArr.length; i++ ) {			
				var option = $("<option></option>")
					.attr("value", skinsArr[i])
					.text(skinsArr[i]);
				$('#skins').append(option);
			}
		});
	});	
}

SkinSelector.prototype.initialize = function(){
	$('<select id="skins"></select>').appendTo(this.rootElement);
	$('<button id="selectSkin">Select skin</button>').appendTo(this.rootElement).click(function(){
		console.log('selectSkin click');
		var selectedSkin = $("#skins option:selected").val();
		selectSkin( selectedSkin );
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
				updSkins();
			}
		}
	});
		
	console.log("SkinSelector inizialize");
	updSkins();
};

SkinSelector.prototype.update = function(streams) {

}