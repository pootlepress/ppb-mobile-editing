/**
 * Plugin front end scripts
 *
 * @package PPB_Mobile_Editing
 * @version 1.0.0
 */
var pmeAction, pmeHelp, pmeRowIndex, pmeContentIndex, pmeRow, pmeContent;

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
		$rowBgPreview = $( '#row-background-image-preview' ),
		$toolbars = $( '.pme-toolbar' ),
		$contentToolbars = $toolbars.filter( '#pme-content-format, #pme-content-actions' ),
		sync = function () {
			return jQuery.post( ppbAjax.url, ppbAjax, function ( response ) {
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
			close: function () {
			},
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
		},
		rowActions = {
			bgColor: function() {

			},
			bgImage: function() {

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
					ppbAjax.data = ppbData;
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
} );