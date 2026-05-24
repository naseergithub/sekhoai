"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import PipelineButton from "@/components/admin/PipelineButton";
import { AgentStatusBadge } from "@/components/admin/StatusBadge";

type Course = { id: string; title: string };
type Chapter = { id: string; title: string; courseId: string };
type Topic = { id: string; title: string; chapterId: string };
type Subtopic = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  aiGenerated: boolean;
  topicId: string;
};

type AgentLog = {
  id: string;
  subtopicId: string | null;
  model: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  errorMsg: string | null;
  createdAt: string;
  subtopicTitle: string | null;
  subtopicSlug: string | null;
};

type InitialSelection = {
  courseId: string;
  chapterId: string;
  topicId: string;
  subtopicId: string;
};

type AgentDashboardProps = {
  courses: Course[];
  chapters: Chapter[];
  topics: Topic[];
  subtopics: Subtopic[];
  initialSelection: InitialSelection;
};

function firstChapterId(chapters: Chapter[], courseId: string) {
  return chapters.find((c) => c.courseId === courseId)?.id ?? "";
}

function firstTopicId(topics: Topic[], chapterId: string) {
  return topics.find((t) => t.chapterId === chapterId)?.id ?? "";
}

function firstSubtopicId(subtopics: Subtopic[], topicId: string) {
  return subtopics.find((s) => s.topicId === topicId)?.id ?? "";
}

export default function AgentDashboard({
  courses,
  chapters,
  topics,
  subtopics,
  initialSelection,
}: AgentDashboardProps) {
  const [courseId, setCourseId] = useState(initialSelection.courseId);
  const [chapterId, setChapterId] = useState(initialSelection.chapterId);
  const [topicId, setTopicId] = useState(initialSelection.topicId);
  const [subtopicId, setSubtopicId] = useState(initialSelection.subtopicId);

  const [generating, setGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [bulkCourseId, setBulkCourseId] = useState("");
  const [bulkChapterId, setBulkChapterId] = useState("");
  const [bulkTopicId, setBulkTopicId] = useState("");
  const [draftOnly, setDraftOnly] = useState(true);
  const [selectedBulk, setSelectedBulk] = useState<Set<string>>(new Set());
  const [bulkRunning, setBulkRunning] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
  const [bulkSummary, setBulkSummary] = useState<string | null>(null);

  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const [logsStatus, setLogsStatus] = useState<string>("");
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  const filteredChapters = chapters.filter((c) => c.courseId === courseId);
  const filteredTopics = topics.filter((t) => t.chapterId === chapterId);
  const filteredSubtopics = subtopics.filter((t) => t.topicId === topicId);

  const selectedSubtopic = subtopics.find((s) => s.id === subtopicId);

  const bulkFilteredChapters = bulkCourseId
    ? chapters.filter((c) => c.courseId === bulkCourseId)
    : chapters;
  const bulkFilteredTopics = bulkChapterId
    ? topics.filter((t) => t.chapterId === bulkChapterId)
    : bulkTopicId
      ? topics.filter((t) => t.id === bulkTopicId)
      : topics;
  const bulkSubtopics = useMemo(() => {
    let list = subtopics;
    if (bulkCourseId) {
      const chapterIds = chapters
        .filter((c) => c.courseId === bulkCourseId)
        .map((c) => c.id);
      const topicIds = topics
        .filter((t) => chapterIds.includes(t.chapterId))
        .map((t) => t.id);
      list = list.filter((s) => topicIds.includes(s.topicId));
    }
    if (bulkChapterId) {
      const topicIds = topics
        .filter((t) => t.chapterId === bulkChapterId)
        .map((t) => t.id);
      list = list.filter((s) => topicIds.includes(s.topicId));
    }
    if (bulkTopicId) {
      list = list.filter((s) => s.topicId === bulkTopicId);
    }
    if (draftOnly) {
      list = list.filter((s) => !s.published);
    }
    return list;
  }, [subtopics, chapters, topics, bulkCourseId, bulkChapterId, bulkTopicId, draftOnly]);

  const handleCourseChange = (nextCourseId: string) => {
    setCourseId(nextCourseId);
    const nextChapterId = firstChapterId(chapters, nextCourseId);
    setChapterId(nextChapterId);
    const nextTopicId = firstTopicId(topics, nextChapterId);
    setTopicId(nextTopicId);
    setSubtopicId(firstSubtopicId(subtopics, nextTopicId));
  };

  const handleChapterChange = (nextChapterId: string) => {
    setChapterId(nextChapterId);
    const nextTopicId = firstTopicId(topics, nextChapterId);
    setTopicId(nextTopicId);
    setSubtopicId(firstSubtopicId(subtopics, nextTopicId));
  };

  const handleTopicChange = (nextTopicId: string) => {
    setTopicId(nextTopicId);
    setSubtopicId(firstSubtopicId(subtopics, nextTopicId));
  };

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    setLogsError(null);

    try {
      const params = new URLSearchParams({
        page: String(logsPage),
        limit: "20",
      });
      if (logsStatus) params.set("status", logsStatus);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      let res: Response;
      try {
        res = await fetch(`/api/admin/agent/logs?${params}`, {
          credentials: "include",
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      let data: {
        logs?: AgentLog[];
        pagination?: { totalPages: number };
        error?: string;
      } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      setLogs(data.logs ?? []);
      setLogsTotalPages(Math.max(1, data.pagination?.totalPages ?? 1));
    } catch (err) {
      setLogs([]);
      const message =
        err instanceof Error
          ? err.name === "AbortError"
            ? "Request timed out — try Retry"
            : err.message
          : "Failed to load logs";
      setLogsError(message);
    } finally {
      setLogsLoading(false);
    }
  }, [logsPage, logsStatus]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleGenerate = async () => {
    if (!subtopicId) return;
    setGenerating(true);
    setGenerateSuccess(null);
    setGenerateError(null);

    const res = await fetch("/api/admin/agent/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtopicId }),
    });
    const data = await res.json();
    setGenerating(false);

    if (res.ok && data.success) {
      setGenerateSuccess(data.message);
      fetchLogs();
    } else {
      setGenerateError(data.message ?? data.error ?? "Generation failed");
    }
  };

  const handlePublish = async () => {
    if (!subtopicId) return;
    await fetch(`/api/admin/subtopics/${subtopicId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: true }),
    });
    setGenerateSuccess("Published successfully");
  };

  const handleBulkGenerate = async () => {
    const ids = Array.from(selectedBulk);
    if (!ids.length) return;

    setBulkRunning(true);
    setBulkSummary(null);
    setBulkProgress({ current: 0, total: ids.length });

    let succeeded = 0;
    let failed = 0;

    for (let i = 0; i < ids.length; i++) {
      const res = await fetch("/api/admin/agent/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subtopicId: ids[i] }),
      });
      const data = await res.json();
      if (res.ok && data.success) succeeded++;
      else failed++;

      setBulkProgress({ current: i + 1, total: ids.length });

      if (i < ids.length - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    setBulkRunning(false);
    setBulkSummary(`${succeeded} succeeded, ${failed} failed`);
    setSelectedBulk(new Set());
    fetchLogs();
  };

  const toggleBulkSelect = (id: string) => {
    const next = new Set(selectedBulk);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedBulk(next);
  };

  const selectAllBulk = () => {
    if (selectedBulk.size === bulkSubtopics.length) {
      setSelectedBulk(new Set());
    } else {
      setSelectedBulk(new Set(bulkSubtopics.map((s) => s.id)));
    }
  };

  const handleRetry = async (logSubtopicId: string | null) => {
    if (!logSubtopicId) return;
    setGenerating(true);
    const res = await fetch("/api/admin/agent/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtopicId: logSubtopicId }),
    });
    setGenerating(false);
    if (res.ok) fetchLogs();
    else alert("Retry failed");
  };

  const bulkPercent =
    bulkProgress.total > 0
      ? Math.round((bulkProgress.current / bulkProgress.total) * 100)
      : 0;

  return (
    <div className="space-y-10">
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Single Subtopic Generator
        </h2>

        {courses.length === 0 ? (
          <p className="mb-4 text-sm text-amber-700">
            No courses found. Create a course first.
          </p>
        ) : (
        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={courseId}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <select
            value={chapterId}
            onChange={(e) => handleChapterChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {filteredChapters.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <select
            value={topicId}
            onChange={(e) => handleTopicChange(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {filteredTopics.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <select
            value={subtopicId}
            onChange={(e) => setSubtopicId(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {filteredSubtopics.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>
        )}

        {selectedSubtopic && (
          <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="font-medium">
              <span dir="rtl" className="font-urdu">{selectedSubtopic.title}</span>
            </p>
            <div className="mt-2 flex gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  selectedSubtopic.published
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {selectedSubtopic.published ? "Published" : "Draft"}
              </span>
              {selectedSubtopic.aiGenerated && (
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
                  AI Generated
                </span>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || !subtopicId}
          className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Gemini is generating content...
            </span>
          ) : (
            "Generate Content"
          )}
        </button>

        {generateSuccess && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-800">
              {generateSuccess}
            </p>
            <div className="mt-3 flex gap-2">
              <a
                href={`/admin/subtopics/${subtopicId}/preview`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Preview Content
              </a>
              <button
                type="button"
                onClick={handlePublish}
                className="rounded-lg border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
              >
                Publish Now
              </button>
            </div>
          </div>
        )}

        {generateError && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {generateError}
          </div>
        )}

        {subtopicId && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Full pipeline (content + SEO + social)
            </p>
            <PipelineButton subtopicId={subtopicId} variant="primary" />
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Bulk Generator</h2>

        <div className="mb-4 flex flex-wrap gap-3">
          <select
            value={bulkCourseId}
            onChange={(e) => {
              setBulkCourseId(e.target.value);
              setBulkChapterId("");
              setBulkTopicId("");
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <select
            value={bulkChapterId}
            onChange={(e) => {
              setBulkChapterId(e.target.value);
              setBulkTopicId("");
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All Chapters</option>
            {bulkFilteredChapters.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <select
            value={bulkTopicId}
            onChange={(e) => setBulkTopicId(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All Topics</option>
            {bulkFilteredTopics.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draftOnly}
              onChange={(e) => setDraftOnly(e.target.checked)}
            />
            Draft subtopics only
          </label>
        </div>

        <div className="mb-4 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={
                      bulkSubtopics.length > 0 &&
                      selectedBulk.size === bulkSubtopics.length
                    }
                    onChange={selectAllBulk}
                  />
                </th>
                <th className="px-3 py-2 text-left">Title</th>
                <th className="px-3 py-2 text-left">AI?</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {bulkSubtopics.map((s) => (
                <tr key={s.id} className="border-t border-gray-100">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedBulk.has(s.id)}
                      onChange={() => toggleBulkSelect(s.id)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <span dir="rtl" className="font-urdu">{s.title}</span>
                  </td>
                  <td className="px-3 py-2">
                    {s.aiGenerated ? "Yes" : "No"}
                  </td>
                  <td className="px-3 py-2">
                    {s.published ? "Published" : "Draft"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedBulk.size > 0 && (
          <p className="mb-2 text-sm font-medium text-violet-700">
            {selectedBulk.size} subtopics selected
          </p>
        )}

        <button
          type="button"
          onClick={handleBulkGenerate}
          disabled={bulkRunning || selectedBulk.size === 0}
          className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          Generate Selected Content
        </button>

        {bulkRunning && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-gray-600">
              {bulkProgress.current} of {bulkProgress.total} complete...
            </p>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-violet-600 transition-all"
                style={{ width: `${bulkPercent}%` }}
              />
            </div>
          </div>
        )}

        {bulkSummary && (
          <p className="mt-4 text-sm font-medium text-gray-800">
            {bulkSummary}
          </p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Agent Logs</h2>
          <select
            value={logsStatus}
            onChange={(e) => {
              setLogsStatus(e.target.value);
              setLogsPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        {logsError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {logsError}
            <button
              type="button"
              onClick={() => fetchLogs()}
              className="ms-3 font-medium underline"
            >
              Retry
            </button>
          </div>
        )}

        {logsLoading ? (
          <p className="text-sm text-gray-500">Loading logs...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Subtopic</th>
                  <th className="px-3 py-2 text-left">Model</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Time</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-gray-100">
                    <td className="px-3 py-2">
                      <span dir="rtl" className="font-urdu">
                        {log.subtopicTitle ?? "—"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs">{log.model}</td>
                    <td className="px-3 py-2">
                      <AgentStatusBadge status={log.status} />
                    </td>
                    <td className="px-3 py-2 text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      {log.status === "FAILED" && log.subtopicId && (
                        <button
                          type="button"
                          onClick={() => handleRetry(log.subtopicId)}
                          className="rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700"
                        >
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            disabled={logsPage <= 1}
            onClick={() => setLogsPage((p) => p - 1)}
            className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-2 py-1 text-sm text-gray-600">
            Page {logsPage} of {logsTotalPages}
          </span>
          <button
            type="button"
            disabled={logsPage >= logsTotalPages}
            onClick={() => setLogsPage((p) => p + 1)}
            className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
