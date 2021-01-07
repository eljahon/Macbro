<template>
  <ckeditor
    v-bind="$attrs"
    v-on="$listeners"
    :editor="editor"
    :config="editorConfig"
    @ready="onReady"
  >
  </ckeditor>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import FontSize from '@ckeditor/ckeditor5-font/src/fontsize'
import { uploader } from './uploader'

export default {
  data () {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // fontSize: {
        //   options: [
        //     9,
        //     11,
        //     13,
        //     'default',
        //     17,
        //     19,
        //     21
        //   ],
        //   supportAllValues: true
        // },
        extraPlugins: [uploader]
      }
    }
  },
  methods: {
    onReady (editor) {
        // Insert the toolbar before the editable area.
        this.editorConfig.toolbar = ['fontSize', ...Array.from(editor.ui.componentFactory.names())]
        editor.ui.getEditableElement().parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        )
    }
  }
}
</script>

<style>
.ck-editor .ck-editor__main .ck-content img {
  width: 100% !important;
  height: auto !important;
}
.ck-editor .ck-editor__main .ck-content {
    min-height: 300px;
  }
  .ck .ck-reset .ck-editor .ck-rounded-corners {
    min-height: 300px !important;
  }
  .ck-editor__editable {
      min-height: 300px !important;
  }

  .ck-editor__editable_inline {
    min-height: 300px !important;
  }

  :host ::ng-deep .ck-editor__editable_inline {
    min-height: 300px !important;
  }
</style>
