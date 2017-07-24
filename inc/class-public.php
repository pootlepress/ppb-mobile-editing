<?php

/**
 * PPB Mobile Editing public class
 * @property string $token Plugin token
 * @property string $url Plugin root dir url
 * @property string $path Plugin root dir path
 * @property string $version Plugin version
 */
class PPB_Mobile_Editing_Public{

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

	function init() {
		$nonce = filter_input( INPUT_GET, 'ppb-mobile-editing' );

		if ( $nonce && wp_verify_nonce( $nonce, 'ppb-mobile-editing' ) ) {
			var_dump( $nonce );
			$this->hooks();
		}
	}

	private function hooks() {
		//Adding front end JS and CSS in /assets folder
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ) );
		add_action( 'wp_footer', array( $this, 'footer' ) );
	}

	/**
	 * Adds front end stylesheet and js
	 * @action wp_enqueue_scripts
	 * @since 1.0.0
	 */
	public function enqueue() {

		$token = $this->token;
		$url = $this->url;

		wp_enqueue_style( $token . '-css', $url . '/assets/front-end.css' );
		wp_enqueue_script( $token . '-js', $url . '/assets/front-end.js', array( 'jquery' ) );
	}

	public function footer() {
		include 'tpl-editor.php';
	}
}