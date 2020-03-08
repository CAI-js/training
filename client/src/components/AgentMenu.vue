<template>
    <b-menu class="agent-menu is-size-5">
      <b-menu-list aria-role="menu">
        <b-menu-item label="Domains" aria-role="menuitem" icon="folder-multiple-outline" />
        <b-menu-item label="Intents" aria-role="menuitem" icon="message-outline" />
        <b-menu-item label="Settings" aria-role="menuitem" icon="settings-outline" />
      </b-menu-list>
    </b-menu>
</template>
<style>
.agent-menu {
  margin-top: 4rem;
}
.agent-menu a:not(:hover) {
  color: whitesmoke;
}
.agent-menu .menu-list a.is-active {
  background-color: whitesmoke;
  color: #363636;
}
.agent-menu .icon {
  margin-right: .25rem;
}
</style>