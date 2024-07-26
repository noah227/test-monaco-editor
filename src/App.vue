<template>
	<div id="editor-wrapper">
		<div id="control">
			<label for="lang-select">切换语言：</label>
			<select id="lang-select" v-model="language">
				<option v-for="lang in languageList" :key="lang" :value="lang">{{ lang }}</option>
			</select>
			<label for="theme-select">切换主题：</label>
			<select id="theme-select" v-model="theme">
				<option v-for="t in themeList" :key="t" :value="t">{{ t }}</option>
			</select>
			<label for="minimap-select">minimap：</label>
			<input v-model="minimapShow" type="checkbox" id="minimap-select">
		</div>
		<Editor v-model="content" :language="language" :theme="theme" :minimap="minimapShow"
				@save="handleSave"></Editor>
	</div>
</template>

<script lang="ts" setup>
import Editor from "@/components/Editor.vue"
import {ref} from "vue";
import {editor} from "monaco-editor";
import BuiltinTheme = editor.BuiltinTheme;

const content = ref("")
const language = ref("javascript")
const languageList = [
	"javascript",
	"json",
	"python"
]
const theme = ref<BuiltinTheme>("vs")
const themeList = [
	"vs",
	"vs-dark",
	"hc-black",
	"hc-light",
]

const minimapShow = ref(true)

const handleSave = () => {
	console.log("Editor Save事件")
}
</script>

<style lang="scss">
html, body, #app {
	width: 100%;
	height: 100%;
	margin: 0;
}

#editor-wrapper {
	width: 100%;
	height: 100%;
	padding: 2%;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;

	> div:first-child {
		flex-shrink: 0;

		> label {
			user-select: none;
		}

		> select {
			padding: 3px 8px;

			&:not(:last-child) {
				margin-right: 12px;
			}
		}
	}

	> div:last-child {
		flex-grow: 1;
	}
}
</style>
