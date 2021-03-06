/**
 * Plugin front end scripts
 *
 * @package PPB_Mobile_Editing
 * @version 1.0.0
 */
var pmeAction, pmeHelp, pmeRowIndex, pmeContentIndex, pmeRow, pmeBlock, pmeRowColor, pmeContent, pmeTemplateAction,
	pmePublish;

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
		$rowColor = $( '#pme-row-color' ),
		$rowBgPreview = $( '#row-background-image-preview' ),
		$blockStyle = $( '#pme-block' ),
		$blockColor = $( '#pme-block-color' ),
		$blockBgPreview = $( '#block-background-image-preview' ),
		$insTpl = $( '#pme-insert-tpl' ),
		$toolbars = $( '.pme-toolbar' ),
		$loading = $( '#loading' ),
		$contentToolbars = $toolbars.filter( '#pme-content-format, #pme-content-actions' ),
		getBlockStyle = function ( i, prop ) {
			i = i ? i : pmeContentIndex;
			var blk = ppbData.widgets[i];
			if ( blk && blk.info && blk.info.style ) {
				var style = JSON.parse( blk.info.style );
				if ( prop ) {
					if ( style[prop] ) {
						return style[prop];
					}
				} else {
					return style;
				}
			}
			return '';
		},
		setBlockStyle = function ( i, prop, val ) {
			i = i ? i : pmeContentIndex;
			var blk = ppbData.widgets[i];
			blk = blk ? blk : {};
			blk.info = blk.info ? blk.info : {};
			blk.info.style = blk.info.style ? blk.info.style : '{}';
			var style = JSON.parse( blk.info.style );
			style[prop] = val;
			blk.info.style = JSON.stringify( style );
			ppbData.widgets[i] = blk;
		},
		sync = function ( publish, loadingTxt ) {
			var msg = 'Synchronizing...';

			delete pmeData.publish;

			if ( publish ) {
				if ( publish === 'publish' ) {
					pmeData.publish = 'Publish';
					msg = 'Publishing...';
				} else {
					msg = publish;
				}
			}

			if ( loadingTxt ) {
				msg = loadingTxt;
			}

			$loading.find( 'h4' ).html( msg );
			$loading.fadeIn( 250 );

			pmeData.data = ppbData;

			return jQuery.post( pmeData.url, pmeData, function ( response ) {

				if ( publish !== 'publish' ) {
					var $html = $( '<div>' + response + '</div>' );
					$html.find( '.pootle-live-editor[data-index]' ).each( function () {
						var
							$t = $( this ),
							i = $t.data( 'index' );
						$t.closest( '.ppb-row, .ppb-block' ).attr( 'data-index', $t.data( 'index' ) );
					} );
					$html.find( '.pootle-live-editor' ).remove();
					$html.find( '[class*="ui-resizable"]' ).remove();
					$html.find( '.ppb-block' ).each( function () {
						$( this )
							.find( '.pootle-live-editor-realtime' )
							.addClass( 'pme-content' ).removeClass( 'pootle-live-editor-realtime' );
					} );

					$( '#pootle-page-builder' ).html( $html.find( '#pootle-page-builder' ).html() );
					$( window ).resize();
				} else {
					delete pmeData.publish;
				}
				doneEditing();
			} );
		},
		resort = function() {
			ppbData.widgets.sort( function ( a, b ) {
				var ac, ag, ai, bc, bg, bi;
				if ( ! a.info ) {
					return 1;
				}
				if ( ! b.info ) {
					return - 1;
				}
				ag = parseInt( a.info.grid );
				ac = parseInt( a.info.cell );
				ai = parseInt( a.info.id );
				bg = parseInt( b.info.grid );
				bc = parseInt( b.info.cell );
				bi = parseInt( b.info.id );
				return ag * 10000 + ac * 1000 + ai - (
					bg * 10000 + bc * 1000 + bi
				);
			} );
			ppbData.grid_cells.sort( function ( a, b ) {
				var ag, ai, bg, bi;
				ag = parseInt( a.grid );
				ai = parseInt( a.id );
				bg = parseInt( b.grid );
				bi = parseInt( b.id );
				return ag * 100 + ai - (
					bg * 100 + bi
				);
			} );
		},
		doneEditing = function ( msg ) {
			msg = msg ? msg : 'Done';
			$toolbars.hide( 500 );
			$( '.pme-editing' ).removeClass( 'pme-editing' );

			if ( editing.blk ) {
				editing.blk.prop( 'contentEditable', false );
			}

			// Reset editing object
			editing.state = false;
			editing.row = null;
			editing.blk = null;

			$loading.addClass( 'done-loading' );
			$loading.find( 'h4' ).html( msg );
			setTimeout( function () {
				$loading.fadeOut( 250, function () {
					$loading.removeClass( 'done-loading' );
				} );
			}, 700 );
		},
		actions = {
			close: function () {
			},
			deleteRow: function () {
				var rowI = pmeRowIndex, removeCells = [], removeBlocks = [], gi;
				ppbData.grids.splice( rowI, 1 );

				$.each( ppbData.widgets, function ( i, v ) {
					if ( v && v.info ) {
						if ( rowI == parseInt( v.info.grid ) ) {
							removeBlocks.push( i );
						} else if ( rowI < parseInt( v.info.grid ) ) {
							ppbData.widgets[i].info.grid --;
						}
					}
				} );

				$.each( ppbData.grid_cells, function ( i, v ) {
					var gi = ppbData.grid_cells[i].grid;
					if ( v ) {
						if ( rowI == gi ) {
							removeCells.push( i );
						} else if ( rowI < gi ) {
							ppbData.grid_cells[i].grid = -- gi;
						}
					}
				} );

				removeBlocks.sort( function ( a, b ) {
					return b - a;
				} ); // Sort descending
				$.each( removeBlocks, function ( i, v ) {
					ppbData.widgets.splice( v, 1 );
				} ); // Splice Blocks

				removeCells.sort( function ( a, b ) {
					return b - a;
				} ); // Sort descending
				$.each( removeCells, function ( i, v ) {
					ppbData.grid_cells.splice( v, 1 )
				} ); // Splice Cells

				ppbData.grids.filter( function () {
					return true;
				} );
				ppbData.widgets.filter( function () {
					return true;
				} );
				ppbData.grid_cells.filter( function () {
					return true;
				} );

				editing.row.remove();
				sync();
			},
			styleRow: function () {
				var bg = ppbData.grids[pmeRowIndex].style.background_image;

				bg = bg ? 'url(' + bg + ')' : ppbData.grids[pmeRowIndex].style.background;

				$rowBgPreview.css( 'background', bg );

				$rowBg.fadeIn( 500 );
			},
			styleBlock: function () {
				var blk = ppbData.widgets[pmeContentIndex];
				if ( blk && blk.info && blk.info.style ) {
					var
						style = JSON.parse( blk.info.style ),
						bg = style['background-image'];

					bg = bg ? 'url(' + bg + ')' : style['background-color'];

					$blockBgPreview.css( 'background', bg );
				}

				$blockStyle.fadeIn( 500 );
			},
			editContent: function () {
				editing.state = true; // Enable editing mode
				var $t = editing.blk;
				$t.addClass( 'pme-editing' );
				$t.prop( 'contentEditable', true );
				$contentToolbars.show( 500 );
			},
			insertTemplate: function () {
				$insTpl.fadeIn( 500 );
			},
		},
		moveRow = function ( oldI, newI ) {
			if ( newI == oldI ) {
				return;
			}

			var
				range = [oldI, newI],
				diff = newI < oldI ? 1 : - 1;

			ppbData.grids.splice( newI, 0, ppbData.grids.splice( oldI, 1 )[0] )

			range = range.sort( function ( a, b ) {
				return a - b;
			} );

			$.each( ppbData.widgets, function ( i, v ) {
				var gi;
				if ( v && v.info ) {
					gi = parseInt( v.info.grid );
					if ( range[0] <= gi && range[1] >= gi ) {
						if ( gi == oldI ) {
							ppbData.widgets[i].info.grid = newI;
						} else {
							ppbData.widgets[i].info.grid = gi + diff;
						}
					}
				}
			} );
			$.each( ppbData.grid_cells, function ( i, v ) {
				var gi;
				if ( v ) {
					gi = parseInt( v.grid );
					ppbData.grid_cells[i].old_grid = gi;
					if ( range[0] <= gi && range[1] >= gi ) {
						if ( gi == oldI ) {
							ppbData.grid_cells[i].grid = newI;
						} else {
							ppbData.grid_cells[i].grid = gi + diff;
						}
					}
				}
			} );
			resort();
		},
		rowActions = {
			close: function () {
				$rowBg.fadeOut();
			},
			setColor: function ( color ) {
				ppbData.grids[pmeRowIndex].style.background = color;
				ppbData.grids[pmeRowIndex].style.bg_overlay_color = color;
				ppbData.grids[pmeRowIndex].style.bg_overlay_opacity = '0.5';
				if ( color ) {
					$rowBgPreview.add( editing.row ).css( 'background', color );
					ppbData.grids[pmeRowIndex].style.background_toggle = '.bg_color';
				}
				$rowBg.fadeIn();
				$rowColor.fadeOut();
			},
			bgColor: function () {
				$rowBg.fadeOut();
				$rowColor.fadeIn();
			},
			bgImage: function () {
				ShrameeUnsplashImage( function ( url ) {
					$rowBgPreview.add( editing.row ).css( 'background-image', 'url(' + url + ')' );

					ppbData.grids[pmeRowIndex].style.background_image = url;
					ppbData.grids[pmeRowIndex].style.background_toggle = '.bg_image';

				} );
			},
			clearImage: function () {
				$rowBgPreview.add( editing.row ).css( 'background', 'none' );

				ppbData.grids[pmeRowIndex].style.background_image = '';
			}
		},

		blockActions = {
			close: function () {
				$blockStyle.fadeOut();
			},
			setColor: function ( color ) {
				$blockBgPreview.add( editing.blk ).css( 'background', color );
				setBlockStyle( pmeContentIndex, 'background-color', color );
				setBlockStyle( pmeContentIndex, 'background-image', '' );
				$blockStyle.fadeIn();
				$blockColor.fadeOut();
			},
			bgColor: function () {
				$blockStyle.fadeOut();
				$blockColor.fadeIn();
			},
			bgImage: function () {
				ShrameeUnsplashImage( function ( url ) {
					$blockBgPreview.add( editing.blk ).css( 'background-image', 'url(' + url + ')' );
					setBlockStyle( pmeContentIndex, 'background-image', url );
				} );
			},
			clearImage: function () {
				$blockBgPreview.add( editing.blk ).css( 'background', 'none' );

				setBlockStyle( pmeContentIndex, 'background-image', '' );
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
				ppbData.widgets[pmeContentIndex].text = editing.blk.find( '.pme-content' ).html();
				pmeData.data = ppbData;
				doneEditing();
			},
			discard: function () {
				if ( confirm( 'Really discard content?' ) ) {
					editing.blk.find( '.pme-content' ).html( ppbData.widgets[pmeContentIndex].text );
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

	var tpl;
	for ( var i = 0; i < pmeUserTemplates.length; i ++ ) {
		tpl = pmeUserTemplates[i];
		pmeTemplates['utpl-' + tpl['name']] = tpl;
	}

	//region Action triggers

	pmeRowColor = function ( color ) {
		rowActions.setColor( color );
	};

	pmeBlockColor = function ( color ) {
		blockActions.setColor( color );
	};

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

	pmeBlock = function ( action ) {
		if ( typeof blockActions[action] === 'function' ) {
			blockActions[action]();
		}
	};

	pmeHelp = function ( that ) {
		$( that ).toggleClass( 'active' );
	};

	pmePublish = function () {
		if ( confirm( 'Publish all changes?' ) ) {
			sync( 'publish' );
		}
	};

	//endregion

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

	applyTemplate = function ( index ) {
		var cells, tpl;
		tpl = pmeTemplates[pmeTemplateAction.tpl];
		cells = 1;
		if ( tpl.content ) {
			cells = tpl.content.length;
		}

		addTplRow(
			cells,
			tpl.content,
			tpl.style ? JSON.parse( tpl.style ) : {}
		);

		if ( index ) {
			moveRow( ppbData.grids.length - 1, index );
		}

		pmeData.data = ppbData;

		sync( 'Adding content...' );

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
			pmeTemplateAction.apply();
		}
		pmeTemplateAction.clicked = true;
		setTimeout(
			function () {
				// Single click
				if ( pmeTemplateAction.clicked ) {
					pmeTemplateAction.clicked = false;
					pmeTemplateAction.preview();
				}
			}, 500
		);
	};

	pmeTemplateAction.preview = function () {
		tpl = pmeTemplates[pmeTemplateAction.tpl];
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
		pmeTemplateAction.back();
		$insTpl.fadeOut();
	};
	pmeTemplateAction.apply = function () {
		applyTemplate( pmeRowIndex + 1 );
	};
} );