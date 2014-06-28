function SkinSelector(){}

SkinSelector.prototype.initialize = function(){
	$('<label id="lolz">lol</label>').appendTo(this.rootElement);
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