function toggleSidebar()
{
  if (document.body.classList.contains("side-collapsed"))
  {
    document.body.classList.remove("side-collapsed");
    localStorage.setItem("side-collapsed", 0);
  }
  else
  {
    document.body.classList.add("side-collapsed");
    localStorage.setItem("side-collapsed", 1);
  }
}
window.onload = function() {
  if (localStorage.getItem("side-collapsed") == "1")
  {
    document.body.classList.add("side-collapsed");
  }
}

// kate: replace-tabs false; indent-width: 2;