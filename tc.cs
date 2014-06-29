function getSkinsFiles(%vehicleDir, %skinDir) {
	%i = 0;
	if ( isFile( %vehicleDir @ "skins/materials_def.cs" ) ) {
		pathCopy( %vehicleDir @ "skins/materials_def.cs", %vehicleDir @ "materials.cs", false );
	}
	else {
		return "nope";
	}
	if ( endsWith( %skinDir, "/Default" ) ) {
		return "default";
	}
	for( %file = findFirstFile( %skinDir @ "/*.dds" ); %file !$= ""; %file = findNextFile() ) {
		%i++;
		%str = "";
		%filename = strreplace( %file, %skinDir @ "/", "" );
		
		%fileReader = new FileObject();
		%fileReader.openForRead( %vehicleDir @ "materials.cs" );
		while ( !%fileReader.isEOF() ) {
			%tmp = %str;
			%line = %fileReader.readLine();
			%str = %tmp NL %line;
			%text = strreplace( %str, %vehicleDir @ %filename, %file );
			%str = %text;
		}
		%fileReader.close();
		%fileReader = new FileObject();
		%fileReader.openForWrite(%vehicleDir @ "materials.cs");
		%fileReader.writeLine(%text);
		%fileReader.close();		
	}
	return "done";
}