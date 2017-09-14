<?php
/**
 * PPB Mobile Editing Admin class
 * @property string token Plugin token
 * @property string $url Plugin root dir url
 * @property string $path Plugin root dir path
 * @property string $version Plugin version
 */
class PPB_Mobile_Editing_Admin{

	/**
	 * @var 	PPB_Mobile_Editing_Admin Instance
	 * @access  private
	 * @since 	1.0.0
	 */
	private static $_instance = null;

	/**
	 * Main PPB Mobile Editing Instance
	 * Ensures only one instance of Storefront_Extension_Boilerplate is loaded or can be loaded.
	 * @return PPB_Mobile_Editing_Admin instance
	 * @since 	1.0.0
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
	 * @since 	1.0.0
	 */
	private function __construct() {
		$this->token   =   PPB_Mobile_Editing::$token;
		$this->url     =   PPB_Mobile_Editing::$url;
		$this->path    =   PPB_Mobile_Editing::$path;
		$this->version =   PPB_Mobile_Editing::$version;

		$this->hooks();
	} // End __construct()

	private function hooks() {
		add_action( 'wp_ajax_nopriv_ppb_app_user', array( $this, 'app_user_status' ) );
		add_action( 'wp_ajax_ppb_app_user', array( $this, 'app_user_logged_in' ) );
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	//region User login workflow
	public function app_user_status() {
		setcookie( 'ppb-redirect', filter_input( INPUT_GET, 'redirect' ) );
		header( 'Location: ' . site_url( '/wp-login.php' ) . '?redirect_to=' . urlencode( admin_url( 'admin-ajax.php?action=ppb_app_user' ) ) );
		exit();
	}

	public function app_user_logged_in() {
		$nonce = wp_create_nonce( 'ppb-mobile-editing' );
		$redirect = filter_input( INPUT_GET, 'redirect' );
		if ( isset( $_COOKIE['ppb-redirect'] ) ) {
			$redirect = $_COOKIE['ppb-redirect'];
		}

		$redirect = str_replace( '#logged-in', "?nonce=$nonce#logged-in", $redirect );

		header( "Location: $redirect" );
	}
	//endregion

	//region REST API routes

	function register_routes() {
		register_rest_route( 'ppb/v1', '/pages', array(
			'methods' => 'GET',
			'callback' => array( $this, 'get_pages' ),
		) );
	}

	function get_pages() {
		global $Pootle_Page_Builder;

		$query = $Pootle_Page_Builder->ppb_posts();

		$json  = array(
			'site_url' => site_url(),
			'posts'    => array(),
			'nonce' => wp_create_nonce( 'ppb-ipad-live-edit' ),
		);

		foreach ( $query->posts as $post ) {
			$json['posts'][] = array(
				'title'  => $post->post_title,
				'link'   => get_permalink( $post ),
				'type'   => $post->post_type,
				'status' => $post->post_status,
			);
		}
		return $json;
	}

	//endregion

}