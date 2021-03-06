function getSkinsFiles( %vehicleDir, %skinDir, %skinName ) {
	if ( isFile( %vehicleDir @ "skins/materials_def.cs" ) ) {
		pathCopy( %vehicleDir @ "skins/materials_def.cs", %vehicleDir @ "materials.cs", false );
	}
	else {
		return "nope";
	}
	if ( endsWith( %skinDir, "/Default" ) ) {
		return "default";
	}
	%str = "";
	%fileReader = new FileObject();
	%fileReader.openForRead( %vehicleDir @ "materials.cs" );
	while ( !%fileReader.isEOF() ) {
		%tmp = %str;
		%line = %fileReader.readLine();
		for( %file = findFirstFile( %skinDir @ "/*.dds" ); %file !$= ""; %file = findNextFile() ) {
			%filename = strreplace( %file, %skinDir @ "/", "" );
			if ( strpos( %line, %filename ) >= 0 ) {
				%line = strreplace( %line, %vehicleDir, "" );
				%line = strreplace( %line, %filename, %file );
			}
		}
		%str = %tmp NL %line;
	}
	%fileReader.close();
	%fileReader = new FileObject();
	%fileReader.openForWrite(%vehicleDir @ "materials.cs");
	%fileReader.writeLine(%str);
	%fileReader.close();
	return "done";
}