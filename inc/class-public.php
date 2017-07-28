<?php

/**
 * PPB Mobile Editing public class
 * @property string $token Plugin token
 * @property string $url Plugin root dir url
 * @property string $path Plugin root dir path
 * @property string $version Plugin version
 */
class PPB_Mobile_Editing_Public{

	//region Properties

	/** @var int Number of rows */
	private $rowCount = 0;

	/** @var int Number of rows */
	private $contentCount = 0;

	private $nonce;
	//endregion

	//region Instantiation

	/**
	 * @var 	PPB_Mobile_Editing_Public Instance
	 * @access  private
	 * @since 	1.0.0
	 */
	private static $_instance = null;

	/**
	 * Main PPB Mobile Editing Instance
	 * Ensures only one instance of Storefront_Extension_Boilerplate is loaded or can be loaded.
	 * @since 1.0.0
	 * @return PPB_Mobile_Editing_Public instance
	 */
	public static function instance() {
		if ( null == self::$_instance ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	} // End instance()

	/**
	 * Constructor function.
	 * @access  private
	 * @since   1.0.0
	 */
	private function __construct() {
		$this->token   =   PPB_Mobile_Editing::$token;
		$this->url     =   PPB_Mobile_Editing::$url;
		$this->path    =   PPB_Mobile_Editing::$path;
		$this->version =   PPB_Mobile_Editing::$version;

		add_action( 'wp', array( $this, 'init' ) );
	} // End __construct()

	//endregion

	/**
	 * Verifies nonce and initiates mobile editor on success
	 * @since 1.0.0
	 */
	function init() {
		$nonce = filter_input( INPUT_GET, 'ppb-mobile-editing' );

		if ( $nonce ) {
			if ( wp_verify_nonce( $nonce, 'ppb-mobile-editing' ) ) {
				$this->nonce = $nonce;
				show_admin_bar( false );
				add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ) );
				add_action( 'wp_footer', array( $this, 'footer' ) );

				add_filter( 'pootlepb_content_block', array( $this, 'content' ), 5 );
				add_filter( 'pootlepb_row_style_attributes',		array( $this, 'row_attr' ), 10, 2 );
				add_filter( 'pootlepb_content_block_attributes',	array( $this, 'content_attr' ), 10, 2 );
				add_filter( 'pootlepb_after_pb',	array( $this, 'after_pb' ), 10, 2 );
			} else {
				echo '<h2>Nonce Validation failed for mobile editing</h2>' . wp_create_nonce( 'ppb-mobile-editing' );
			}
		}
	}

	/**
	 * Adds or modifies the row attributes
	 * @param array $attr Row html attributes
	 * @param array $settings Row settings
	 * @return array Row html attributes
	 * @filter pootlepb_row_style_attributes
	 * @since 1.0.0
	 */
	public function row_attr( $attr ) {
			$attr['data-index'] = $this->rowCount++;

		return $attr;
	}

	/**
	 * Adds or modifies the row attributes
	 * @param array $attr Row html attributes
	 * @param array $settings Row settings
	 * @return array Row html attributes
	 * @filter pootlepb_row_style_attributes
	 * @since 1.0.0
	 */
	public function content_attr( $attr ) {
		$attr['data-index'] = $this->contentCount++;

		return $attr;
	}

	/**
	 * @return string
	 */
	public function after_pb() {
		$this->rowCount = 0;
		$this->contentCount = 0;
	}

	/**
	 * Adds front end stylesheet and js
	 * @action wp_enqueue_scripts
	 * @since 1.0.0
	 */
	public function enqueue() {

		global $post;

		$token = $this->token;
		$url = $this->url;

		wp_enqueue_style( $token . '-css', $url . '/assets/front-end.css' );
		wp_enqueue_script( $token . '-js', $url . '/assets/front-end.js', array( 'jquery' ) );

		//Grid data
		$panels_data = get_post_meta( $post->ID, 'panels_data', true );
		if ( $panels_data && count( $panels_data ) > 0 ) {

			wp_localize_script( $token . '-js', 'ppbData', $panels_data );

			wp_localize_script( $token . '-js', 'ppbAjax', array(
				'url'    => admin_url( 'admin-ajax.php' ),
				'publish' => true,
				'action' => 'pootlepb_live_editor',
				'post'   => $post->ID,
				'nonce'  => $this->nonce,
			) );
		}
	}

	/**
	 * Wraps the content in .pootle-live-editor-realtime and convert short codes to strings
	 *
	 * @param string $content
	 *
	 * @return string Content
	 */
	public function content( $content ) {
		$content = str_replace( array( '[', ']' ), array( '&#91;', '&#93;' ), $content );

		return "<div class='pme-content'>$content</div>";
	}

	public function footer() {
		include 'tpl-editor.php';
	}
}