function SkinSelector(){}

function changeMatFile(vehicleDir, skinName) {	
	var code = 'function getSkinsFiles(%vehicleDir, %skinDir) { %i = 0; if ( isFile( %vehicleDir @ "skins/materials_def.cs" ) ) { pathCopy( %vehicleDir @ "skins/materials_def.cs", %vehicleDir @ "materials.cs", false ); } else { return "nope"; } if ( endsWith( %skinDir, "/Default" ) ) { return "default"; } for( %file = findFirstFile( %skinDir @ "/*.dds" ); %file !$= ""; %file = findNextFile() ) { %i++; %str = ""; %filename = strreplace( %file, %skinDir @ "/", "" ); %fileReader = new FileObject(); %fileReader.openForRead( %vehicleDir @ "materials.cs" ); while ( !%fileReader.isEOF() ) { %tmp = %str; %line = %fileReader.readLine(); %str = %tmp NL %line; %text = strreplace( %str, %vehicleDir @ %filename, %file ); %str = %text; } %fileReader.close(); %fileReader = new FileObject(); %fileReader.openForWrite(%vehicleDir @ "materials.cs"); %fileReader.writeLine(%text); %fileReader.close(); } return "done"; }';
	executeGameEngineCode( code );
	console.log(vehicleDir +"skins/" +skinName);
	var skinDir = vehicleDir +"skins/" +skinName;
	callGameEngineFuncCallback('getSkinsFiles("' +vehicleDir +'", "' +skinDir +'")', function(result) {
		console.log('skins=' +result);
	});			
}

function selectSkin(skinName) {
	callLuaFuncCallback('v.vehicleDirectory', function(result) {		
		var materialsFile = result +'materials.cs';
		var defaultMaterialsFile = result +'skins/materials_def.cs';
		console.log('matFile=' +materialsFile);
		console.log('backMatFile=' +defaultMaterialsFile);
		callGameEngineFuncCallback('isFile("' +defaultMaterialsFile +'")', function(res) {
			console.log('res=' +res);
			if (res == 0) {
				callGameEngineFuncCallback('pathCopy("' +materialsFile +'", "' +defaultMaterialsFile +'", false)', function(res) {
					console.log('backup done');
				});
			}
			changeMatFile( result, skinName);
		});
	});
}

SkinSelector.prototype.initialize = function(){
	$('<label id="lolz">lol</label>').appendTo(this.rootElement);
	$('<button id="click_btn">3232</button>').appendTo(this.rootElement).click(function(){
		console.log('click_btn click');
		/*callGameEngineFuncCallback('pathCopy("vehicles/pigeon/pigeon_c.dds", "vehicles/pigeon/skins/pigeon_c.dds", false)', function(res) {
			console.log('res=' +res);
		});*/
		selectSkin('Default');
	});
	$( document ).bind( "keydown", function(evt) {
		if ( evt.ctrlKey && evt.keyCode == 66 )
		{
			//$(this).hide();
			//$("#lolz").hide();
			console.log('1');
			console.log($(this).width());
			if ($('.SkinSelector').is(':visible'))
			{
				$('.SkinSelector').parent().parent().hide( 'slow' );
			}
			else
			{
				$('.SkinSelector').parent().parent().show( 'slow' );
			}
		}
		//console.log('2');
		//console.log(evt);
	});
		
	console.log("SkinSelector inizialize");
};

SkinSelector.prototype.update = function(streams) {

}