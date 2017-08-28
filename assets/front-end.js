/**
 * Plugin front end scripts
 *
 * @package PPB_Mobile_Editing
 * @version 1.0.0
 */
var pmeAction, pmeHelp, pmeRowIndex, pmeContentIndex, pmeRow, pmeContent, pmeTemplateAction;

jQuery( function ( $ ) {
	var justClicked,
		editing = {
			state: false,
			row: null,
			blk: null,
		},
		$body = $( 'body' ),
		$acts = $( '#pme-actions' ),
		$rowBg = $( '#pme-row' ),
		$insTpl = $( '#pme-insert-tpl' ),
		$rowBgPreview = $( '#row-background-image-preview' ),
		$toolbars = $( '.pme-toolbar' ),
		$contentToolbars = $toolbars.filter( '#pme-content-format, #pme-content-actions' ),
		sync = function () {
			return jQuery.post( pmeData.url, pmeData, function ( response ) {
				doneEditing();
				console.log( 'Saved page' );
			} );
		},
		doneEditing = function () {
			$toolbars.hide( 500 );
			$( '.pme-editing' ).removeClass( 'pme-editing' );

			editing.blk.prop( 'contentEditable', false );

			// Reset editing object
			editing.state = false;
			editing.row = null;
			editing.blk = null;
		},
		actions = {
			close: function () {},
			styleRow: function () {
//				editing.state = true; // Enable editing mode
				var
					$t = editing.blk,
					bg = ppbData.grids[pmeRowIndex].style.background_image;

				bg = bg ? 'url(' + bg + ')' : ppbData.grids[pmeRowIndex].style.background;

				$rowBgPreview.css( 'background', bg );

				$rowBg.fadeIn( 500 );
			},
			editContent: function () {
				editing.state = true; // Enable editing mode
				var $t = editing.blk;
				$t.addClass( 'pme-editing' );
				$t.prop( 'contentEditable', true );
				$contentToolbars.show( 500 );
			},
			insertTemplate: function() {
				$insTpl.fadeIn( 500 );
			},
		},

		rowActions = {
			close: function () {
				$rowBg.fadeOut();
			},
			bgColor: function() {

			},
			bgImage: function() {
				ShrameeUnsplashImage(function(url) {
					$rowBgPreview.add( editing.row ).css( 'background', 'url(' + url + ')' );

					ppbData.grids[pmeRowIndex].style.background_image = url;

				});
			},
			clearImage: function () {
				$rowBgPreview.add( editing.row ).css( 'background', 'none' );

				ppbData.grids[pmeRowIndex].style.background_image = '';
			}
		},

		contentActions = {
			createLink: function () {
				var link = prompt( 'Where should we link to?', '' );
				if ( link ) {
					document.execCommand( 'createLink', false, link );
				}
			},
			element: function ( tagName ) {
				var
					sel = document.getSelection(),
					$el = $( sel.anchorNode.parentElement );
				if ( $el.css( 'display' ) !== 'block' ) {
					$el = $el.parentsUntil( '.ppb-block' ).filter( function () {
						return $( this ).css( "display" ) === "block";
					} ).first();
				}
				if ( $el.length ) {
					$el.replaceWith( $( '<' + tagName + '>' + $el.html() + '</' + tagName + '>' ) )
				}
			},
			save: function () {
				var save = confirm( 'Save all changes?' );
				if ( save ) {
					pmeData.data = ppbData;
					ppbData.widgets[pmeContentIndex].text = editing.blk.html();
					sync();
				}
			},
			discard: function () {
				var discard = confirm( 'Are you sure you want to discard all changes?' );
				if ( discard ) {
					doneEditing();
				}
			},
		};

	$body.on( 'click', '.pme-dropdown-toggle', function ( e ) {
		$( this ).find( '.pme-dropdown' ).slideToggle();
	} );
	$body.on( 'click', '.ppb-row[data-index]', function ( e ) {
		var $t = $( e.target );
		if ( justClicked ) {
			editing.row = $t.closest( '.ppb-row[data-index]' );
			editing.blk = $t.closest( '.ppb-block[data-index]' );
			pmeRowIndex = editing.row.data( 'index' );
			pmeContentIndex = editing.blk.data( 'index' );
			$acts.fadeIn().addClass( 'active' );
		} else {
			justClicked = ! editing.state; // Opposite of editing mode, i.e. false when editing
			setTimeout( function () {
				justClicked = false;
			}, 500 );
		}
	} );

	pmeAction = function ( action ) {
		$acts.removeClass( 'active' ).fadeOut();
		if ( typeof actions[action] === 'function' ) {
			actions[action]();
		}
	};

	pmeContent = function ( action, args ) {
		if ( typeof contentActions[action] === 'function' ) {
			contentActions[action]( args );
		} else {
			document.execCommand( action, false, args ? args : '' );
		}
	};

	pmeRow = function ( action ) {
		if ( typeof rowActions[action] === 'function' ) {
			rowActions[action]();
		}
	};

	pmeHelp = function ( that ) {
		$( that ).toggleClass( 'active' );
	};

	addTplRow = function ( numCells, blockData, rowStyle ) {
		var rowID, block, cells, defaultText, i, id, row;
		rowID = ppbData.grids.length;

		ppbData.grids.push( {
			id: rowID,
			cells: numCells,
			style: 'object' === typeof rowStyle ? rowStyle : {}
		} );

		cells = {
			grid: rowID,
			weight: 1 / numCells
		};

		defaultText = typeof blockData === 'string' ? blockData : '<h2>Hi there,</h2><p>I am a new content block, go ahead, edit me and make me cool...</p>';

		block = {
			text: defaultText,
			info: {
				"class": 'Pootle_PB_Content_Block',
				grid: rowID,
				style: '{"background-color":"","background-transparency":"","text-color":"","border-width":"","border-color":"","padding":"","rounded-corners":"","inline-css":"","class":"","wc_prods-add":"","wc_prods-attribute":"","wc_prods-filter":null,"wc_prods-ids":null,"wc_prods-category":null,"wc_prods-per_page":"","wc_prods-columns":"","wc_prods-orderby":"","wc_prods-order":""}'
			}
		};
		i = 0;
		while ( i < numCells ) {
			id = ppbData.grid_cells.length;
			cells.id = id;
			ppbData.grid_cells.push( $.extend( true, {}, cells ) );
			id = ppbData.widgets.length;
			block.info.cell = i;
			block.info.id = id;
			if ( blockData && blockData[i] ) {
				block.text = typeof blockData[i].text === 'string' ? blockData[i].text : defaultText;
				block.info.style = typeof blockData[i].style === 'string' ? blockData[i].style : '{}';
			}
			ppbData.widgets.push( $.extend( true, {}, block ) );
			i ++;
		}
	};

	applyTemplate = function () {
		var cells, tpl;
		tpl = pmeData.tpls[ pmeTemplateAction.tpl ];
		cells = 1;
		if ( tpl.content ) {
			cells = tpl.content.length;
		}

		addTplRow(
			cells,
			tpl.content,
			tpl.style ? JSON.parse( tpl.style ) : {}
		);

		// Reset pmeTemplateAction
		pmeTemplateAction.tpl = '';
		$insTpl
			.removeClass( 'tpl-preview' )
			.css( 'background-image', '' )
			.fadeOut();
	};

	pmeTemplateAction = function ( tpl ) {
		pmeTemplateAction.tpl = tpl;

		if ( pmeTemplateAction.clicked ) {
			// Second click under 500ms
			pmeTemplateAction.clicked = false;
			applyTemplate();
		}
		pmeTemplateAction.clicked = true;
		setTimeout(
			function() {
				// Single click
				if ( pmeTemplateAction.clicked ) {
					pmeTemplateAction.clicked = false;
					pmeTemplateAction.preview();
				}
			}, 500
		);
	};

	pmeTemplateAction.preview = function() {
		tpl = pmeData.tpls[ pmeTemplateAction.tpl ];
		$insTpl
			.addClass( 'tpl-preview' )
			.css( 'background-image', 'url(' + tpl.img + ')' );
	};

	pmeTemplateAction.back = function () {
		pmeTemplateAction.tpl = '';
		$insTpl
			.removeClass( 'tpl-preview' )
			.css( 'background-image', '' );
	};

	pmeTemplateAction.close = function () {
		pmeTemplateAction.tpl = '';
		$insTpl
			.removeClass( 'tpl-preview' )
			.css( 'background-image', '' );
	};
	pmeTemplateAction.apply = function () {
		applyTemplate();
	};
} );