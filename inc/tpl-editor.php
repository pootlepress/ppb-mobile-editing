<div onclick="pmeHelp(this)" class="pme-help">
	<i class="fa fa-question pme-expand"></i>
	<i class="fa fa-close pme-close"></i>
	<p>Double tap page builder rows to edit.</p>
</div>

<div class="pme-panel flex" id="pme-actions" style="display: none;">
	<div class="actions">
		<a href="javascript:pmeAction('close')" class="action">
			<i class="fa fa-close"></i>
			<div>close</div>
		</a>
		<a href="javascript:pmeAction('styleRow')" class="action">
			<i class="fa fa-picture-o"></i>
			<div>row background</div>
		</a>
		<a href="javascript:pmeAction('editContent')" class="action">
			<i class="fa fa-pencil-square-o"></i>
			<div>edit content</div>
		</a>
		<a href="javascript:pmeAction('insertTemplate')" class="action">
			<i class="fa fa-plus"></i>
			<div>insert template</div>
		</a>
	</div>
</div>

<div class="pme-panel flex" id="pme-row-color" style="display: none;">
	<div class="actions">
		<span onclick="pmeRowColor('#3498db')" style="background:#3498db">Peter river</span>
		<span onclick="pmeRowColor('#2a84be')" style="background:#2a84be">Belize hole</span>

		<span onclick="pmeRowColor('#34495e')" style="background:#34495e">Wet asphalt</span>
		<span onclick="pmeRowColor('#2c3e50')" style="background:#2c3e50">Midnight blue</span>

		<span onclick="pmeRowColor('#1abc9c')" style="background:#1abc9c">Turquoise</span>
		<span onclick="pmeRowColor('#16a085')" style="background:#16a085">Green sea</span>
		<span onclick="pmeRowColor('#2abb67')" style="background:#2abb67">Nephritis</span>
		<span onclick="pmeRowColor('#2ecc71')" style="background:#2ecc71">Emerald</span>

		<span onclick="pmeRowColor('#9b59b6')" style="background:#9b59b6">Amethyst</span>
		<span onclick="pmeRowColor('#8e44ad')" style="background:#8e44ad">Wisteria</span>

		<span onclick="pmeRowColor('#f1c40f')" style="background:#f1c40f">Sun flower</span>
		<span onclick="pmeRowColor('#f39c12')" style="background:#f39c12">Orange</span>
		<span onclick="pmeRowColor('#d35400')" style="background:#d35400">Pumpkin</span>
		<span onclick="pmeRowColor('#e67e22')" style="background:#e67e22">Carrot</span>

		<span onclick="pmeRowColor('#e74c3c')" style="background:#e74c3c">Alizarin</span>
		<span onclick="pmeRowColor('#c0392b')" style="background:#c0392b">Pomegranate</span>

		<span onclick="pmeRowColor('#ffffff')" style="background:#ffffff">White</span>
		<span onclick="pmeRowColor('#ecf0f1')" style="background:#ecf0f1">Clouds</span>
		<span onclick="pmeRowColor('#bdc3c7')" style="background:#bdc3c7">Silver</span>
		<span onclick="pmeRowColor('#95a5a6')" style="background:#95a5a6">Concrete</span>
		<span onclick="pmeRowColor('#707677')" style="background:#707677">Asbestos</span>
		<span onclick="pmeRowColor('#454a4f')" style="background:#454a4f">Grey</span>
		<span onclick="pmeRowColor('#303539')" style="background:#303539">Dark grey</span>
		<span onclick="pmeRowColor('#000000')" style="background:#000000">Black</span>
		<span onclick="pmeRowColor('')" style="background:transparent">No color</span>
	</div>
</div>

<div class="pme-panel flex" id="pme-row" style="display: none;">
	<div class="actions">
		<a href="javascript:pmeRow('close')" class="action">
			<i class="fa fa-close"></i>
			<div>close</div>
		</a>
		<a href="javascript:pmeRow('bgColor')" class="action">
			<i class="fa fa-paint-brush"></i>
			<div>background color</div>
		</a>
		<a href="javascript:pmeRow('bgImage')" class="action">
			<i class="fa fa-picture-o"></i>
			<div>background image</div>
		</a>
		<a id="row-background-image-preview" href="javascript:pmeRow('clearImage')" class="action">
			<i class="fa fa-trash-o "></i>
			<div>background preview</div>
		</a>
	</div>
</div>

<div id="pme-content-format" class="flex pme-toolbar" style="display:none;">
	<select onchange="pmeContent('element', this.value)" id="pme-content-element">
		<option value="">Text style</option>
		<option value="h1">Title</option>
		<option value="h2">Heading</option>
		<option value="h3">Sub Heading</option>
		<option value="h4">Small Heading</option>
		<option value="p">Paragraph</option>
		<option value="pre">Preformatted</option>
		<option value="blockquote">Quote</option>
	</select>
	<a href="javascript:void(0)" class="fa fa-font pme-dropdown-toggle">
		<span class="pme-dropdown" style="display:none;">
			<i onclick="pmeContent('bold')" class="fa fa-bold"></i>
			<i onclick="pmeContent('italic')" class="fa fa-italic"></i>
			<i onclick="pmeContent('underline')" class="fa fa-underline"></i>
		</span>
	</a>

	<a href="javascript:void(0)" class="fa fa-align-left pme-dropdown-toggle">
		<span class="pme-dropdown" style="display:none;">
			<i onclick="pmeContent('justifyLeft')" class="fa fa-align-left"></i>
			<i onclick="pmeContent('justifyCenter')" class="fa fa-align-center"></i>
			<i onclick="pmeContent('justifyRight')" class="fa fa-align-right"></i>
		</span>
	</a>

	<a href="javascript:pmeContent('createLink')" class="fa fa-link"></a>

	<span class="pme-separator"></span>

	<a href="javascript:pmeContent('save')" class="fa fa-check"></a>
	<a href="javascript:pmeContent('discard')" class="fa fa-close"></a>

	<span></span>
</div>

<div id="pme-insert-tpl" class="pme-panel flex" style="display:none;">

	<div class="preview-actions actions">
		<a href="javascript:pmeTemplateAction.back()" class="action">
			<i class="fa fa-close"></i>
			<div>close</div>
		</a>
		<a href="javascript:pmeTemplateAction.apply()" class="action">
			<i class="fa fa-check"></i>
			<div>apply</div>
		</a>
	</div>

	<div class="templates actions">
		<a href="javascript:pmeTemplateAction.close()" class="action">
			<i class="fa fa-close"></i>
			<div>close</div>
		</a>
		<?php
		foreach ( $this->tpls as $id => $tpl ) {
			if ( ! empty( $tpl['img'] ) ) {
				echo
					"<div class='ppb-tpl' onclick='pmeTemplateAction(\"$id\")'>" .
					"<img src='$tpl[img]' alt='$id'>" .
					"<h3>$id</h3>" .
					"</div>";
			}
		}
		?>
	</div>

	<div onclick="pmeHelp(this)" class="pme-help">
		<i class="fa fa-exclamation pme-expand"></i>
		<i class="fa fa-close pme-close"></i>
		<p>Single tap to preview, double tap to quick insert.</p>
	</div>

</div>
