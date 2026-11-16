
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useParams,
} from "react-router-dom";
import { supabase } from "./supabase";
import "./App.css";

const CATEGORIES = [
  "Discussion",
  "Question",
  "Opinion",
  "Recommendation",
  "Travel Tip",
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=85";

const getWikipediaUrl = (name) =>
  `https://en.wikipedia.org/wiki/${encodeURIComponent(name)}`;

function formatDate(date) {
  if (!date) return "Just now";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function visitorName(id) {
  return id ? `Traveler-${id.slice(0, 6).toUpperCase()}` : "Traveler";
}

function getVideoEmbed(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}`;
    }

    if (host.endsWith("youtube.com")) {
      const id =
        parsed.searchParams.get("v") ||
        parsed.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/)?.[1];

      return id
        ? `https://www.youtube-nocookie.com/embed/${id}`
        : null;
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];

      return id && /^\d+$/.test(id)
        ? `https://player.vimeo.com/video/${id}`
        : null;
    }
  } catch {
    return null;
  }

  return null;
}

async function getWikipediaInformation(cities) {
  return Promise.all(
    cities.map(async (city) => {
      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city.name)}`
        );

        if (!response.ok) {
          throw new Error("Wikipedia unavailable");
        }

        const data = await response.json();

        return {
          ...city,
          description: data.description || "",
          summary: data.extract || "",
          wikipediaUrl:
            data.content_urls?.desktop?.page || getWikipediaUrl(city.name),
        };
      } catch {
        return {
          ...city,
          description: "",
          summary: "",
          wikipediaUrl: getWikipediaUrl(city.name),
        };
      }
    })
  );
}

function Loading({ message = "Loading..." }) {
  return (
    <div className="loading-state" role="status">
      <span className="spinner" />
      <p>{message}</p>
    </div>
  );
}

function ErrorMessage({ children }) {
  if (!children) return null;

  return (
    <p className="error-message" role="alert">
      {children}
    </p>
  );
}

/* NAVIGATION */


function SiteHeader({ user }) {
  return (
    <header className="site-header">
      <Link to="/" className="site-brand">
        <span className="brand-icon">✦</span>
        <strong>EuroExplore</strong>
      </Link>

      <nav className="site-nav" aria-label="Main navigation">
        <NavLink to="/" end className={({ isActive }) =>
          `site-nav-link${isActive ? " active" : ""}`
        }>
          Home
        </NavLink>

        <NavLink to="/destinations" className={({ isActive }) =>
          `site-nav-link${isActive ? " active" : ""}`
        }>
          Destinations
        </NavLink>

        <NavLink to="/community" className={({ isActive }) =>
          `site-nav-link${isActive ? " active" : ""}`
        }>
          Community
        </NavLink>
      </nav>

      <div className="header-actions">
        <span className="header-traveler">
          {visitorName(user?.id)}
        </span>

        <Link to="/create" className="primary-button">
          Create Post
        </Link>
      </div>
    </header>
  );
}


function PageLayout({ children }) {
  return <main className="main-content">{children}</main>;
}


function HomePage({ cities, loading, error }) {
  const featuredCities = cities.slice(0, 6);

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            Your European escape begins here
          </p>

          <h1>
            Somewhere between
            <br />
            here and <span>everywhere.</span>
          </h1>

          <p className="hero-description">
            Discover beautiful places, find your next destination,
            and make every journey unforgettable.
          </p>

          <div className="hero-actions">
            <Link to="/destinations" className="primary-button">
              Explore Europe →
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img src={HERO_IMAGE} alt="Beautiful European coastline" />

          <div className="hero-image-caption">
            Your next adventure awaits
          </div>
        </div>
      </section>

      <section className="featured-destinations">
        <div className="featured-heading">
          <div>
            <p className="eyebrow">A CONTINENT TO DISCOVER</p>
            <h2>Find your somewhere.</h2>
            <p>
              From charming old towns to sunlit coastlines, explore
              destinations across Europe.
            </p>
          </div>

          <Link to="/destinations" className="text-link">
            View all destinations →
          </Link>
        </div>

        <ErrorMessage>{error}</ErrorMessage>

        {loading ? (
          <Loading message="Discovering destinations..." />
        ) : featuredCities.length > 0 ? (
          <div className="featured-grid">
            {featuredCities.map((city) => (
              <Link
                to={`/cities/${city.id}`}
                className="featured-card"
                key={city.id}
              >
                <img
                  src={city.image || FALLBACK_IMAGE}
                  alt={city.name}
                />

                <div className="featured-card-content">
                  <h3>{city.name}</h3>
                  <p>{city.country}</p>
                  <span className="text-link">
                    Explore city →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="empty-message">
            Destinations are not available right now.
          </p>
        )}
      </section>
    </div>
  );
}

/* COMMUNITY FEED */

function PostCard({ post, showContent, showImages }) {
  return (
    <article className="post-card">
      <Link to={`/posts/${post.id}`} className="post-card-main">
        <div className="post-meta">
          <span>{formatDate(post.created_at)}</span>
        </div>

        <h2>{post.title}</h2>

        {showContent && post.content && (
          <p className="post-preview">{post.content}</p>
        )}

        {showImages && post.image_url && (
          <img className="feed-image" src={post.image_url} alt="" />
        )}

        <div className="post-card-footer">
          <span className="upvote-count">
            ▲ {post.upvotes || 0} upvotes
          </span>
        </div>
      </Link>
    </article>
  );
}

function FeedPage({ posts, loading, error, refreshPosts }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("All Categories");
  const [showContent, setShowContent] = useState(false);
  const [showImages, setShowImages] = useState(false);

  const filteredPosts = useMemo(() => {
    const result = posts.filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All Categories" || post.category === category;

      return matchesSearch && matchesCategory;
    });

    return result.sort((a, b) => {
      if (sort === "popular") {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }

      if (sort === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }

      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [posts, search, sort, category]);

  return (
    <section className="page-content">
      <header className="page-header feed-header">
        <div>
          <p className="eyebrow">THE EUROEXPLORE COMMUNITY</p>
          <h1>Travel Discussions</h1>
          <p className="page-subtitle">
            Share your experiences, ask questions, and find inspiration
            for your next European adventure.
          </p>
        </div>

        <Link to="/create" className="primary-button">
          + Create Post
        </Link>
      </header>

      <div className="feed-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search posts by title..."
          aria-label="Search posts by title"
        />

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Sort posts"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="popular">Most Upvoted</option>
        </select>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          <option>All Categories</option>
          {CATEGORIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <details className="feed-settings">
        <summary>Customize feed</summary>

        <div className="settings-options">
          <label>
            <input
              type="checkbox"
              checked={showContent}
              onChange={(event) => setShowContent(event.target.checked)}
            />
            Show post text in feed
          </label>

          <label>
            <input
              type="checkbox"
              checked={showImages}
              onChange={(event) => setShowImages(event.target.checked)}
            />
            Show images in feed
          </label>
        </div>
      </details>

      <div className="section-heading feed-section-heading">
        <div>
          <h2>Community Feed</h2>
          <p>
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "post" : "posts"} found
          </p>
        </div>
      </div>

      <ErrorMessage>{error}</ErrorMessage>

      {loading ? (
        <Loading message="Loading community posts..." />
      ) : filteredPosts.length ? (
        <div className="posts-list">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showContent={showContent}
              showImages={showImages}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">✦</span>
          <h2>No posts found</h2>

          <p>
            {posts.length
              ? "Try a different search or category filter."
              : "Be the first traveler to start a discussion!"}
          </p>

          <Link to="/create" className="primary-button">
            Create the First Post
          </Link>
        </div>
      )}

      <button
        className="subtle-button refresh-button"
        onClick={refreshPosts}
      >
        ↻ Refresh feed
      </button>
    </section>
  );
}

/* CREATE AND EDIT POSTS */

function PostForm({ user, existingPost, onSaved }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState(existingPost?.title || "");
  const [content, setContent] = useState(existingPost?.content || "");
  const [imageUrl, setImageUrl] = useState(existingPost?.image_url || "");
  const [videoUrl, setVideoUrl] = useState(existingPost?.video_url || "");
  const [category, setCategory] = useState(
    existingPost?.category || "Discussion"
  );
  const [repostId, setRepostId] = useState(existingPost?.repost_of || "");
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function uploadImage() {
    if (!imageFile) {
      return imageUrl.trim() || null;
    }

    const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filePath = `${user.id}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(filePath, imageFile, { upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a post title.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const image = await uploadImage();

      if (repostId.trim()) {
        const { data: referencedPost, error: lookupError } = await supabase
          .from("posts")
          .select("id")
          .eq("id", repostId.trim())
          .maybeSingle();

        if (lookupError) throw lookupError;

        if (!referencedPost) {
          throw new Error("We couldn't find a post with that ID.");
        }
      }

      const values = {
        title: title.trim(),
        content: content.trim(),
        image_url: image,
        video_url: videoUrl.trim() || null,
        category,
        repost_of: repostId.trim() || null,
      };

      let result;

      if (existingPost) {
        result = await supabase
          .from("posts")
          .update(values)
          .eq("id", existingPost.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("posts")
          .insert([{ ...values, author_id: user.id }])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      await onSaved();
      navigate(`/posts/${result.data.id}`);
    } catch (submitError) {
      setError(
        submitError.message || "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page-content narrow-page">
      <Link
        to={existingPost ? `/posts/${existingPost.id}` : "/community"}
        className="back-link"
      >
        ← Back
      </Link>

      <header className="page-header">
        <div>
          <p className="eyebrow">EUROEXPLORE COMMUNITY</p>
          <h1>{existingPost ? "Edit Your Post" : "Create a Post"}</h1>
          <p className="page-subtitle">
            Share a travel story, ask a question, or help another traveler.
          </p>
        </div>
      </header>

      <form className="form-card" onSubmit={handleSubmit}>
        <label htmlFor="post-title">
          Post Title <span className="required">*</span>
        </label>

        <input
          id="post-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What would you like to discuss?"
          maxLength={150}
          required
        />

        <label htmlFor="post-category">Category</label>

        <select
          id="post-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {CATEGORIES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <label htmlFor="post-content">
          Additional Text <span className="optional">(optional)</span>
        </label>

        <textarea
          id="post-content"
          rows={7}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Tell the community more..."
        />

        <label htmlFor="post-image-url">
          Image URL <span className="optional">(optional)</span>
        </label>

        <input
          id="post-image-url"
          type="url"
          value={imageUrl}
          onChange={(event) => {
            setImageUrl(event.target.value);
            setImageFile(null);
          }}
          placeholder="https://example.com/your-image.jpg"
        />

        <label htmlFor="post-image-file">
          Or upload an image from your device
        </label>

        <input
          id="post-image-file"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(event) => {
            setImageFile(event.target.files?.[0] || null);

            if (event.target.files?.[0]) {
              setImageUrl("");
            }
          }}
        />

        {imageFile && (
          <p className="field-hint">Selected: {imageFile.name}</p>
        )}

        <label htmlFor="post-video">
          Video URL <span className="optional">(YouTube or Vimeo)</span>
        </label>

        <input
          id="post-video"
          type="url"
          value={videoUrl}
          onChange={(event) => setVideoUrl(event.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />

        <label htmlFor="repost-id">
          Reference Another Post ID{" "}
          <span className="optional">(optional)</span>
        </label>

        <input
          id="repost-id"
          value={repostId}
          onChange={(event) => setRepostId(event.target.value)}
          placeholder="Paste the ID of an existing post"
        />

        <p className="field-hint">
          You can find a post ID in its details page or browser address.
        </p>

        <ErrorMessage>{error}</ErrorMessage>

        <button
          className="primary-button form-submit"
          disabled={saving}
        >
          {saving
            ? "Saving Post..."
            : existingPost
              ? "Save Changes"
              : "Publish Post"}
        </button>
      </form>
    </section>
  );
}

/* COMMENTS */

function CommentSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadComments = useCallback(async () => {
    setLoading(true);

    const { data, error: queryError } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (queryError) {
      setError(queryError.message);
    } else {
      setComments(data || []);
    }

    setLoading(false);
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  async function submitComment(event) {
    event.preventDefault();

    if (!content.trim()) return;

    setSaving(true);
    setError("");

    const { error: insertError } = await supabase
      .from("comments")
      .insert([
        {
          post_id: postId,
          content: content.trim(),
          author_id: user.id,
        },
      ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setContent("");
      await loadComments();
    }

    setSaving(false);
  }

  async function deleteComment(commentId) {
    if (!window.confirm("Delete this comment?")) return;

    const { error: deleteError } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      await loadComments();
    }
  }

  return (
    <section className="comments-section">
      <div className="section-heading">
        <div>
          <h2>Discussion</h2>
          <p>
            {comments.length}{" "}
            {comments.length === 1 ? "comment" : "comments"}
          </p>
        </div>
      </div>

      <form className="comment-form" onSubmit={submitComment}>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          required
        />

        <button
          className="primary-button"
          disabled={saving || !content.trim()}
        >
          {saving ? "Posting..." : "Add Comment"}
        </button>
      </form>

      <ErrorMessage>{error}</ErrorMessage>

      {loading ? (
        <Loading message="Loading comments..." />
      ) : comments.length ? (
        <div className="comments-list">
          {comments.map((comment) => (
            <article className="comment-card" key={comment.id}>
              <div className="comment-heading">
                <strong>{visitorName(comment.author_id)}</strong>
                <span>{formatDate(comment.created_at)}</span>
              </div>

              <p>{comment.content}</p>

              {comment.author_id === user.id && (
                <button
                  className="danger-text"
                  onClick={() => deleteComment(comment.id)}
                >
                  Delete comment
                </button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-message">
          No comments yet. Start the conversation!
        </p>
      )}
    </section>
  );
}

/* POST DETAILS */

function PostDetail({ posts, postsLoading, user, refreshPosts }) {
  const { postId } = useParams();
  const navigate = useNavigate();

  const post = posts.find((item) => item.id === postId);

  const [upvoting, setUpvoting] = useState(false);
  const [error, setError] = useState("");

  async function upvote() {
    if (!post) return;

    setUpvoting(true);
    setError("");

    const { error: voteError } = await supabase.rpc(
      "increment_post_upvotes",
      { post_id_input: post.id }
    );

    if (voteError) {
      setError(voteError.message);
    } else {
      await refreshPosts();
    }

    setUpvoting(false);
  }

  async function deletePost() {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this post?"
      )
    ) {
      return;
    }

    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    await refreshPosts();
    navigate("/community");
  }

  if (postsLoading && !post) {
    return <Loading message="Loading post..." />;
  }

  if (!post) {
    return (
      <section className="page-content">
        <h1>Post Not Found</h1>
        <p className="page-subtitle">
          This post may have been deleted.
        </p>
        <Link to="/community" className="back-link">
          ← Back to Community
        </Link>
      </section>
    );
  }

  const referencedPost = posts.find(
    (item) => item.id === post.repost_of
  );

  const videoEmbed = getVideoEmbed(post.video_url);
  const isOwner = post.author_id === user.id;

  return (
    <section className="page-content">
      <Link to="/community" className="back-link">
        ← Back to Community
      </Link>

      <article className="detail-post">
        <div className="post-meta">
          <span className="category-badge">{post.category}</span>
          <span>{formatDate(post.created_at)}</span>
        </div>

        <h1>{post.title}</h1>

        <p className="post-author-line">
          Posted by {visitorName(post.author_id)}
        </p>

        {post.content && (
          <p className="detail-post-content">{post.content}</p>
        )}

        {post.image_url && (
          <img
            className="detail-post-image"
            src={post.image_url}
            alt="Post attachment"
          />
        )}

        {post.video_url &&
          (videoEmbed ? (
            <div className="video-wrapper">
              <iframe
                src={videoEmbed}
                title="Shared video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              className="text-link"
              href={post.video_url}
              target="_blank"
              rel="noreferrer"
            >
              Watch shared video ↗
            </a>
          ))}

        {post.repost_of && (
          <div className="repost-box">
            <p className="eyebrow">REFERENCED POST</p>

            {referencedPost ? (
              <Link to={`/posts/${referencedPost.id}`}>
                <strong>{referencedPost.title}</strong>
                <span>Open original discussion →</span>
              </Link>
            ) : (
              <p>The referenced post is no longer available.</p>
            )}
          </div>
        )}

        <div className="detail-post-actions">
          <button
            className="upvote-button"
            onClick={upvote}
            disabled={upvoting}
          >
            ▲{" "}
            {upvoting
              ? "Upvoting..."
              : `Upvote · ${post.upvotes || 0}`}
          </button>

          {isOwner && (
            <div className="owner-actions">
              <Link
                to={`/posts/${post.id}/edit`}
                className="secondary-button"
              >
                Edit Post
              </Link>

              <button
                className="delete-button"
                onClick={deletePost}
              >
                Delete Post
              </button>
            </div>
          )}
        </div>

        <ErrorMessage>{error}</ErrorMessage>
      </article>

      <CommentSection postId={post.id} user={user} />
    </section>
  );
}

function CreatePost({ user, refreshPosts }) {
  return <PostForm user={user} onSaved={refreshPosts} />;
}

function EditPost({ user, posts, postsLoading, refreshPosts }) {
  const { postId } = useParams();
  const post = posts.find((item) => item.id === postId);

  if (postsLoading && !post) {
    return <Loading message="Loading post..." />;
  }

  if (!post) {
    return (
      <section className="page-content">
        <h1>Post Not Found</h1>
        <Link to="/community" className="back-link">
          ← Back to Community
        </Link>
      </section>
    );
  }

  if (post.author_id !== user.id) {
    return (
      <section className="page-content">
        <h1>You can't edit this post</h1>
        <p className="page-subtitle">
          Only the original author can edit it.
        </p>
        <Link to={`/posts/${post.id}`} className="back-link">
          ← Return to Post
        </Link>
      </section>
    );
  }

  return (
    <PostForm
      user={user}
      existingPost={post}
      onSaved={refreshPosts}
    />
  );
}

/* DESTINATIONS */

function DestinationsPage({ cities, loading, error }) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All Regions");

  const regions = [
    ...new Set(cities.map((city) => city.region).filter(Boolean)),
  ];

  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      (city.country || "").toLowerCase().includes(search.toLowerCase());

    return (
      matchesSearch &&
      (region === "All Regions" || city.region === region)
    );
  });

  return (
    <section className="page-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">EXPLORE EUROPE</p>
          <h1>European Destinations</h1>
          <p className="page-subtitle">
            Browse the cities in your travel collection and discover
            somewhere new.
          </p>
        </div>
      </header>

      <div className="feed-toolbar">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search cities or countries..."
          aria-label="Search cities or countries"
        />

        <select
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          aria-label="Filter by region"
        >
          <option>All Regions</option>
          {regions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <ErrorMessage>{error}</ErrorMessage>

      {loading ? (
        <Loading message="Loading destinations..." />
      ) : (
        <div className="destination-grid">
          {filteredCities.map((city) => (
            <Link
              to={`/cities/${city.id}`}
              className="destination-card"
              key={city.id}
            >
              <img
                src={city.image || FALLBACK_IMAGE}
                alt={city.name}
              />

              <div>
                <span className="category-badge">{city.region}</span>
                <h2>{city.name}</h2>
                <p>{city.country}</p>

                {city.description && (
                  <p className="destination-description">
                    {city.description}
                  </p>
                )}

                <span className="text-link">
                  Explore city →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && filteredCities.length === 0 && (
        <p className="empty-message">
          No destinations match your search.
        </p>
      )}
    </section>
  );
}

function CityDetail({ cities, loading }) {
  const { cityId } = useParams();

  const city = cities.find(
    (item) => String(item.id) === cityId
  );

  if (loading && !city) {
    return <Loading message="Loading destination..." />;
  }

  if (!city) {
    return (
      <section className="page-content">
        <h1>Destination Not Found</h1>
        <Link to="/destinations" className="back-link">
          ← Back to Destinations
        </Link>
      </section>
    );
  }

  const related = cities.filter(
    (item) => item.region === city.region && item.id !== city.id
  );

  return (
    <section className="page-content">
      <Link to="/destinations" className="back-link">
        ← Back to Destinations
      </Link>

      <header className="page-header">
        <div>
          <p className="eyebrow">DESTINATION GUIDE</p>
          <h1>{city.name}</h1>
          <p className="page-subtitle">
            {city.country} · {city.region}
          </p>
        </div>
      </header>

      <img
        className="city-detail-image"
        src={city.image || FALLBACK_IMAGE}
        alt={city.name}
      />

      <article className="detail-post">
        <h2>About {city.name}</h2>

        {city.description && <p>{city.description}</p>}

        <p>
          {city.summary || "A summary is not currently available."}
        </p>

        <a
          className="text-link"
          href={city.wikipediaUrl}
          target="_blank"
          rel="noreferrer"
        >
          Read more on Wikipedia ↗
        </a>
      </article>

      {related.length > 0 && (
        <section className="related-section">
          <h2>More in {city.region}</h2>

          <div className="related-cities">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/cities/${item.id}`}
                className="related-city-link"
              >
                {item.name} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

/* APP ROUTES */

function AppContent({
  user,
  posts,
  postsLoading,
  postsError,
  refreshPosts,
  cities,
  citiesLoading,
  citiesError,
}) {
  return (
    <div className="app-layout">
      <SiteHeader user={user} />

      <PageLayout>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                cities={cities}
                loading={citiesLoading}
                error={citiesError}
              />
            }
          />

          <Route
            path="/community"
            element={
              <FeedPage
                posts={posts}
                loading={postsLoading}
                error={postsError}
                refreshPosts={refreshPosts}
              />
            }
          />

          <Route
            path="/create"
            element={
              <CreatePost
                user={user}
                refreshPosts={refreshPosts}
              />
            }
          />

          <Route
            path="/posts/:postId"
            element={
              <PostDetail
                posts={posts}
                postsLoading={postsLoading}
                user={user}
                refreshPosts={refreshPosts}
              />
            }
          />

          <Route
            path="/posts/:postId/edit"
            element={
              <EditPost
                user={user}
                posts={posts}
                postsLoading={postsLoading}
                refreshPosts={refreshPosts}
              />
            }
          />

          <Route
            path="/destinations"
            element={
              <DestinationsPage
                cities={cities}
                loading={citiesLoading}
                error={citiesError}
              />
            }
          />

          <Route
            path="/cities/:cityId"
            element={
              <CityDetail
                cities={cities}
                loading={citiesLoading}
              />
            }
          />

          <Route
            path="*"
            element={
              <section className="page-content">
                <h1>Page Not Found</h1>
                <Link to="/" className="back-link">
                  ← Back to Home
                </Link>
              </section>
            }
          />
        </Routes>
      </PageLayout>
    </div>
  );
}

/* MAIN APP */

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [citiesError, setCitiesError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function initializeUser() {
      setAuthLoading(true);
      setAuthError("");

      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        if (mounted) {
          setAuthError(sessionError.message);
          setAuthLoading(false);
        }
        return;
      }

      if (data.session?.user) {
        if (mounted) {
          setUser(data.session.user);
          setAuthLoading(false);
        }
        return;
      }

      const { data: signInData, error: signInError } =
        await supabase.auth.signInAnonymously();

      if (!mounted) return;

      if (signInError) {
        setAuthError(
          `${signInError.message} Make sure Anonymous Sign-Ins are enabled in Supabase Authentication settings.`
        );
      } else {
        setUser(signInData.user);
      }

      setAuthLoading(false);
    }

    initializeUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted && session?.user) {
          setUser(session.user);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const refreshPosts = useCallback(async () => {
    setPostsLoading(true);
    setPostsError("");

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setPostsError(error.message);
      setPosts([]);
    } else {
      setPosts(data || []);
    }

    setPostsLoading(false);
  }, []);

  const refreshCities = useCallback(async () => {
    setCitiesLoading(true);
    setCitiesError("");

    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setCitiesError(error.message);
      setCities([]);
      setCitiesLoading(false);
      return;
    }

    const enriched = await getWikipediaInformation(data || []);

    setCities(enriched);
    setCitiesLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;

    refreshPosts();
  }, [user, refreshPosts]);

  useEffect(() => {
    refreshCities();
  }, [refreshCities]);

  if (authLoading) {
    return <Loading message="Preparing your travel community..." />;
  }

  if (authError || !user) {
    return (
      <div className="auth-error-screen">
        <h1>Welcome to EuroExplore</h1>
        <p>We couldn't start your community session.</p>

        <ErrorMessage>
          {authError || "No visitor session is available."}
        </ErrorMessage>

        <button
          className="primary-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppContent
        user={user}
        posts={posts}
        postsLoading={postsLoading}
        postsError={postsError}
        refreshPosts={refreshPosts}
        cities={cities}
        citiesLoading={citiesLoading}
        citiesError={citiesError}
      />
    </BrowserRouter>
  );
}

export default App;