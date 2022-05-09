async function deleteFormHandler(event) {
  event.preventDefault();
  // take the post id from the url
  const post_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];
  // use the post id to run the delete route from post
  const response = await fetch(`/api/posts/${post_id}`, {
    method: "DELETE",
  });
  // once deleted take user back to dashboard page
  if (response.ok) {
    document.location.replace("/dashboard/");
  } else {
    alert(response.statusText);
  }
}
// js logic to add "click" then run function
document
  .querySelector(".delete-post-btn")
  .addEventListener("click", deleteFormHandler);
