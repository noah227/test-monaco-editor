<template>
	<div ref="refMonaco" class="editor" @keydown.ctrl="handleCtrlPrevent">

	</div>
</template>

<script lang="ts" setup>
import * as monaco from "monaco-editor"
import {editor} from "monaco-editor"
import {computed, onMounted, ref, shallowRef, watch} from "vue";
import BuiltinTheme = editor.BuiltinTheme;
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;

const props = defineProps({
	modelValue: {
		type: String,
		required: true
	},
	language: {
		type: String,
		required: true
	},
	theme: {
		type: String as () => BuiltinTheme,
		default: "vs"
	},
	minimap: {
		type: Boolean,
		default: false
	}
})

const emits = defineEmits(["update:modelValue", "save"])

const _value = ref(props.modelValue)

watch(() => _value.value, v => {
	emits("update:modelValue", v)
})

const refMonaco = shallowRef()
const refMonacoInstance = shallowRef()

const tid = ref<any>(0)
const getEditorValue = () => new Promise((resolve, reject) => {
	clearTimeout(tid.value)
	tid.value = setTimeout(() => resolve(refMonacoInstance.value.getValue()), 500)
})

const editorOptions = computed<IStandaloneEditorConstructionOptions>(() => ({
	value: _value.value,
	language: props.language,
	automaticLayout: true,
	autoFocus: true,
	minimap: {enabled: props.minimap},
	// locale: "zh-cn"
	theme: props.theme
}))

/**
 * 动态同步Editor的语言设置
 */
watch(() => editorOptions.value.language, language => {
	if (!refMonacoInstance.value) return
	const model = refMonacoInstance.value.getModel()
	model.setLanguage(language)
	console.log("SET LANGUAGE", language)
})

/**
 * 主题切换
 * 这个也可以通过updateOptions来处理
 */
watch(() => editorOptions.value.theme, theme => {
	if (!refMonacoInstance.value) return
	theme && editor.setTheme(theme)
	console.log("SET THEME", theme)
})

/**
 * minimap显示切换
 */
watch(() => editorOptions.value.minimap, m => {
	if (!refMonacoInstance.value) return
	refMonacoInstance.value.updateOptions({minimap: m})
})

const initEditor = () => {
	// 默认格式化快捷键alt+shift+f
	refMonacoInstance.value = monaco.editor.create(refMonaco.value, {
		...editorOptions.value
	})
	// 编辑器变化事件监听
	refMonacoInstance.value.onDidChangeModelContent(() => {
		getEditorValue().then((v) => {
			if (typeof v === "string") _value.value = v
		}).catch(e => console.error(e))
	})
	const keyBindingList = [
		// 格式化
		[monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyL, "editor.action.format"],
		// 换行
		[monaco.KeyMod.Shift | monaco.KeyCode.Enter, "editor.action.insertLineAfter"],
		// 删除行
		[monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyY, "editor.action.deleteLines"],
		// 复制
		[monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, "editor.action.duplicateSelection"],
		// 保存
		[monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, "save"],
	]
	keyBindingList.forEach(([k, action]) => {
		refMonacoInstance.value.addCommand(k, () => {
			refMonacoInstance.value.trigger("", action)
		})
	})
	// 添加保存事件，在前面注册了按键事件 ctrl+s
	refMonacoInstance.value.addAction({
		id: "save",
		label: "save",
		run() {
			emits("save")
		}
	})
	refMonacoInstance.value.focus()
}

const handleCtrlPrevent = (e: KeyboardEvent) => {
	if (e.key === "KeyS") e.preventDefault()
}

defineExpose({
	setValue(value: string) {
		refMonacoInstance.value.setValue(value)
	}
})

onMounted(() => {
	initEditor()
})
</script>

<style lang="scss">
@import "common";
@import "common.variables";

.editor {
	height: 0;
	margin: 1rem 0;
	border: 1px solid $border-color;
}

.margin:first-child {
	border-right: 1px solid $border-color;
	box-sizing: border-box;
}
</style>
