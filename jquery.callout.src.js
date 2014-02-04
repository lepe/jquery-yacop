/*
 * YACOP: Yet Another Callout Plugin
 * @author: A.Lepe (www.alepe.com, www.support.ne.jp)
 * @since: 2010-05-19
 * @version: 2012-09-13
 * @link: http://yacop.alepe.com (For documentation, demo and gallery)
 *
 * CSS based in: http://www.dailycoding.com/Posts/purely_css_callouts.aspx
 * @param options: {
 * 		position: left|right|top|bottom
 * 		align:	center|left|right|top|bottom (where the callout should align in reference with the object)
 * 											  as expected you can not have "position: top" and "align: bottom" as they don't share axis.
 * 		pointer: none|left|right|top|bottom (where does the pointer is located. 'none' will hide it)
 * 		show: Initially shows the callout.
 * 		css: ".callout" css additional class to render the callout.
 * 		fadeIn: int Any number higher than 0 will represent the "fadeIn" timing. A value of 0 will just show it. (default: 2000)
 * 		fadeOut: int Any number higher than 0 will represent the "fadeOut" timing. A value of 0 will just hide it. (default: 1000)
 *      afterCreate: function() to call before destroying the callout
 *      beforeShow: function() to call before showing the callout
 *      afterShow: function() to call after showing the callout
 *      beforeHide: function() to call on hide
 *      afterHide: function() to call on hide
 *      beforeDestroy: function() to call before destroying the callout
 *      beforeReorder: function() to call before reordering the callout on window resize
 *      afterReorder : function() to call after reordering the callout on window resize
 * }
 *
 * HIDE callout:
 * 	$("div").callout("hide");
 *
 * SHOW hidden callout:
 * 	$("div").callout("show");
 *
 * DESTROY callout:
 * 	$("div").callout("destroy");
 *
 * 	Change Log:
    2012-09-13: Added events as suggested by Cemil Fidanlıgül
	2012-05-31: The for loops were iterating through more properties than just the callouts and the callout property was removed upon destroy. Patch sent by: Conan C. Albrecht
    2010-12-15: Class restructured
    2010-12-14: if "title" is present, use that as content
    2010-11-12: Added fadeIn/fadeOut as suggested by Donal Murtagh
    2010-06-21: Shortcut for messages
 */
jQuery.fn.callout = function (options) {
        this.each(function() {
			var caller = this;
			if(options == "hide") {
				var cots = caller.callout;
				if(cots) for(var c = 0; c < cots.length; c++) {
                    cots[c].onCalloutBeforeHide();
					cots[c].fadeOut(cots[c].data("fadeOut"), cots[c].onCalloutAfterHide);
				}
			} else if(options == "show") {
				var cots = caller.callout;
				if(cots) for(var c = 0; c < cots.length; c++) {
                    cots[c].onCalloutBeforeShow();
					cots[c].fadeIn(cots[c].data("fadeIn"), cots[c].onCalloutAfterShow);
				}
				$(caller).callout("reorder");
			} else if(options == "destroy") {
				var cots = caller.callout;
				if(cots) for(var c = 0; c < cots.length; c++) {
                    cots[c].onCalloutBeforeDestroy();
					cots[c].fadeOut(cots[c].data("fadeOut"), function () {
						$(this).remove();
					});
				}
				delete caller.callout;
			} else if(options == "reorder") {
				var cots = caller.callout;
				var ltop	= $(caller).offset().top;
				var lleft 	= $(caller).offset().left;
				if(cots) for(var c = 0; c < cots.length; c++) {
					if(cots[c].is(':visible')) {
                        cots[c].onCalloutBeforeReorder();
						var ctop	= cots[c].offset().top;
						var cleft 	= cots[c].offset().left;
						var ltdiff = ltop - cots[c].attr("top");
						var lldiff = lleft - cots[c].attr("left");
						cots[c].css("top",  ctop + ltdiff);
						cots[c].css("left", cleft + lldiff);
						cots[c].attr("top", ltop);
						cots[c].attr("left",lleft);
                        cots[c].onCalloutAfterReorder();
					}
				}
			} else {
				if(typeof options == "string") options = { msg : options }; //string to object
				options = $.extend({
					width 	: 'auto',
					height 	: 'auto',
					position: 'top',
					align	: 'center',
					pointer	: 'center',
					msg		: 'Example Text',
					css		: '',
					show	: 'true',
					fadeIn	: 2000,
					fadeOut : 1000,
                    zindex  : 10,
                    afterCreate  : function(){},
                    beforeShow   : function(){},
                    afterShow    : function(){},
                    beforeHide   : function(){},
                    afterHide    : function(){},
                    beforeDestroy: function(){},
                    beforeReorder: function(){},
                    afterReorder : function(){}
				}, options || {});

				var position 	= options.position;
				var width 		= options.width;
				var height 		= options.height;
				var msg			= options.msg;
				var align 		= options.align;
				var pointer		= options.pointer;
				var css			= options.css;
                var zindex      = options.zindex;

				var $co = $("<div class='callout_main'></div>");
				var $cont = $("<div class='callout "+css+" callout_cont_"+position+"'>"+msg+"</div>");
				var $tri = $("<div class='callout_tri callout_"+position+"'></div>");
				var $tri2 = $("<div></div>");
				$tri.append($tri2);

				//Define default style
				$co.css("position","absolute").hide();
				$cont.css("zIndex",zindex+1);
				$tri.css("height",0).css("width",0).css("border","10px solid transparent").css("zIndex",zindex);
				$tri2.css("position","relative").css("border","10px solid transparent").css("height",0).css("width",0).css("zIndex",zindex+2);
                $co.data("fadeout", options.fadeOut).data("fadein", options.fadeIn);
                $co.onCalloutBeforeShow = options.beforeShow;
                $co.onCalloutBeforeHide = options.beforeHide;
                $co.onCalloutBeforeDestroy = options.beforeDestroy;
                $co.onCalloutBeforeReorder = options.beforeReorder;
                $co.onCalloutAfterCreate   = options.afterCreate;
                $co.onCalloutAfterShow = options.afterShow;
                $co.onCalloutAfterHide = options.afterHide;
                $co.onCalloutAfterReorder = options.afterReorder;

				$co.append($cont);
				if(position == "bottom" || position == "right")
					$co.prepend($tri);
				else
					$co.append($tri);

				$("body").append($co);
				//Get callout style
				var importStyle = new Array(
						"backgroundColor",
						"borderTopColor","borderLeftColor","borderRightColor","borderBottomColor",
						"borderTopWidth","borderLeftWidth","borderRightWidth","borderBottomWidth",
						"marginTop","marginLeft","marginRight","marginBottom"
				);
				var s = {} //style object
				for(var i = 0; i < importStyle.length; i++) {
					s[importStyle[i]] = $cont.style(importStyle[i]);
				}

				$co.css("marginLeft",s.marginLeft).css("marginRight",s.marginRight).css("marginTop",s.marginTop).css("marginBottom",s.marginBottom);
				$cont.css("margin",0);
				// hide it fron the screen temporally to perform metrics
				var left = -1000;
				var top	 = -1000;
				$co.css("left", left);
				$co.css("top", top);
				$co.show();

				if(width != 'auto')  $co.css("width",width);
				if(height != 'auto') $cont.css("height",height);

				width 	 = $cont.width();
				height 	 = $cont.height();
				var ttop	= $(caller).offset().top;
				var tleft 	= $(caller).offset().left;
				var callerRight = parseInt($(caller).css('right'), 10);
				if (callerRight < 0) {
				  tleft -= callerRight;
			  	}
				var twidth  = $(caller).width();
				var theight = $(caller).height();
				$co.attr("left",tleft);
				$co.attr("top",ttop);

				// Restore non-sense settings
				if(position == "top" || position == "bottom") {
					if(align == "bottom" || align == "top") align = "center";
					if(pointer == "bottom" || pointer == "top") pointer = "center";
				} else {
					if(align == "left" || align == "right") align = "center";
					if(pointer == "left" || pointer == "right") pointer = "center";
				}
				switch(pointer) {
					case "none"	:  	$tri.hide(); break;
					case "left"	:  	$tri.css("marginLeft", 10); break;
					case "right":  	$tri.css("marginLeft", (width > 18) ? width - 10 - 8 : 0); break;
					case "top"	:	$tri.css("top", 10); break;
					case "bottom":	$tri.css("top", (height > 18) ? height - 10 - 8 : 0); break;
				}
				switch(align) {
					case "left"	 : left = tleft; break;
					case "right" : left = tleft + twidth - width - 8; break; //why 8?
					case "top"	 : top = ttop; break;
					case "bottom": top = ttop + theight - height - 10; break; //why 10?
				}
				switch(position) {
					case "top":
					case "bottom":
						if(position == "top") {
							top = ttop - height - 25 //25: just a margin (+ triangle height)
							$tri.css("marginTop",-1).css("borderTopColor",s.borderBottomColor);
							$tri2.css("borderTopColor",s.backgroundColor).css("left",-10).css("top",-12);
						} else {
							top = ttop + theight + 5; //5: just a margin
							$tri.css("marginBottom",-1).css("borderBottomColor",s.borderTopColor);
							$tri2.css("borderBottomColor",s.backgroundColor).css("left",-10).css("top",-8);
						}
						if(align == "center") left = tleft + (twidth / 2) - (width / 2);
						if(pointer == "center")
							$tri.css("marginLeft",(width / 2) - 8); //8: half of the triangle
						else if(pointer == "left" && align == "right") 
							left = tleft + (twidth) - 25; //25: slighly to the left
						else if(pointer == "right" && align == "left")
							left = tleft - width + 25; //25: slighly to the right
						
					break;
					case "left":
					case "right":
						if(position == "left") {
							left = tleft - width - 25; //25: triangle width + margin
							$tri.css("left",width + 10 + 1); //10: triangle width, 1: adjust border
							$tri.css("borderLeftColor",s.borderRightColor);
							$tri2.css("borderLeftColor",s.backgroundColor).css("left",-12).css("top",-10);
						} else {
							left = tleft + twidth + 15; //15: triangle width + margin
							$tri.css("left", - 19); //19: adjust margin
							$tri.css("borderRightColor",s.borderLeftColor);
							$tri2.css("borderRightColor",s.backgroundColor).css("left",-8).css("top",-10);
						}
						$tri.css("position","absolute");
						if(align == "center") top  = ttop + (theight / 2) - (height / 2) - 6; //6: adjust height
						if(pointer == "center") 
							$tri.css("top",(height / 2) - 4); //2: adjust single line
						else if(pointer == "top" && align == "bottom")
							top = ttop + theight - 30;  //25: slighly to the top
						else if(pointer == "bottom" && align == "top")
							top = ttop - height + 20; //25: slighly to the bottom
					break;
				}
				//Hide it and show it gracefuly
				$co.hide();
				$co.css("left",left);
				$co.css("top",top);
                $co.onCalloutAfterCreate();
				if(options.show) {
                    $co.onCalloutBeforeShow();
					$co.fadeIn($co.data("fadeIn"), $co.onCalloutAfterShow);
                }
				if(caller.callout == undefined) {
					caller.callout = new Array();
					$(window).bind("resize", function resizeWindow( e ) {
						$(caller).callout("reorder");
					});
				}
				caller.callout.push($co);
			}
		});
	return this;
}
// From the net (unknown author) and converted by A.Lepe
jQuery.fn.style = function (property){ var el = this[0]; if (el.currentStyle) return el.currentStyle[property]; else if (document.defaultView && document.defaultView.getComputedStyle) return document.defaultView.getComputedStyle(el, "")[property]; else return el.style[property]; }
