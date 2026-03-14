<?php
require_once( dirname( dirname( dirname( dirname( __FILE__ ) ) ) ) . '/wp-load.php' );
flush_rewrite_rules( false );
echo "Rewrite rules flushed successfully.\n";
