<div onclick="pmeHelp(this)" id="pme-help">
	<i class="fa fa-question expand"></i>
	<i class="fa fa-close"></i>
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
			<div>style row</div>
		</a>
		<a href="javascript:pmeAction('editContent')" class="action">
			<i class="fa fa-pencil-square-o"></i>
			<div>edit content</div>
		</a>
		<a href="javascript:pmeAction('styleContent')" class="action">
			<i class="fa fa-plus"></i>
			<div>insert template</div>
		</a>
	</div>
</div>

<div id="pme-content-format" class="flex pme-toolbar" style="display:none;">
	<a href="javascript:pmeContent('left')" class="fa fa-align-left"></a>
	<a href="javascript:pmeContent('center')" class="fa fa-align-center"></a>
	<a href="javascript:pmeContent('right')" class="fa fa-align-right"></a>
<!--	<a href="javascript:pmeContent('justify')" class="fa fa-align-justify"></a>-->
	<a href="javascript:pmeContent('bold')" class="fa fa-bold"></a>
	<a href="javascript:pmeContent('italic')" class="fa fa-italic"></a>
</div>

<div id="pme-content-actions" class="flex pme-toolbar pme-toolbar-bottom" style="display:none;">
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
	<a href="javascript:pmeContent('save')" class="fa fa-check"></a>
	<a href="javascript:pmeContent('discard')" class="fa fa-close"></a>
</div>
