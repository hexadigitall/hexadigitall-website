'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { BookmarkIcon, ArrowDownTrayIcon, BookOpenIcon, MagnifyingGlassIcon, FunnelIcon, ClockIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import BookCard from '@/app/store/BookCard';
import { type BookSummary } from '@/lib/book-queries';

const PROGRESS_KEY_PREFIX = 'reader_progress_';

function getReadingProgress(slug: string): { scrollY: number; timestamp: number; title: string } | null {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY_PREFIX + slug);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

interface DashboardLibraryViewProps {
  user: {
    role: string;
    email: string;
    username?: string;
    name?: string;
  };
  userCourses?: any[]; // Enrolled for students, assigned for teachers
}

export default function DashboardLibraryView({ user, userCourses = [] }: DashboardLibraryViewProps) {
  const [libraryItems, setLibraryItems] = useState<any[]>([]);
  const [catalogItems, setCatalogItems] = useState<BookSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCatalog, setShowCatalog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  // Logic for sectioning the catalog
  const catalogSections = useMemo(() => {
    let filtered = catalogItems;
    
    // Apply search
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(b => 
            b.title.toLowerCase().includes(q) || 
            b.description?.toLowerCase().includes(q) ||
            b.authors?.some(a => a.toLowerCase().includes(q))
        );
    }

    // Apply level filter
    if (levelFilter !== 'all') {
        filtered = filtered.filter(b => b.level === levelFilter);
    }

    if (filtered.length === 0) return { suggested: [], available: [], pipeline: [] };

    // Debug userCourses mapping
    const userCourseIds = new Set(userCourses.map(c => {
        // Enrollment structure: c.course._id
        // Teacher course structure: c._id
        return c.course?._id || c._id;
    }).filter(Boolean));
    
    const userSchoolIds = new Set(userCourses.map(c => {
        return c.course?.school?._id || c.school?._id;
    }).filter(Boolean));
    
    // Suggested: Matching user courses OR matching school (supplementary)
    // ONLY textbooks can be suggested based on courses
    const suggested = filtered.filter(book => {
        if (book._type !== 'book') return false;

        const bookCourseId = book.relatedCourse?._id;
        const bookSchoolId = book.relatedCourse?.school?._id;
        
        const isDirectlyRelated = bookCourseId && userCourseIds.has(bookCourseId);
        const isSupplementary = bookSchoolId && userSchoolIds.has(bookSchoolId);
        
        return book.status === 'available' && (isDirectlyRelated || isSupplementary);
    });

    // Available: Rest of available books/imprints
    const suggestedIds = new Set(suggested.map(b => b._id));
    const available = filtered.filter(item => {
        return item.status === 'available' && !suggestedIds.has(item._id);
    });

    // Pipeline: Coming soon
    const pipeline = filtered.filter(book => book.status === 'coming_soon');

    return { suggested, available, pipeline };
  }, [catalogItems, userCourses, searchQuery, levelFilter]);

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        const [libRes, catalogRes] = await Promise.all([
          fetch(`/api/student/library?email=${encodeURIComponent(user.email)}`),
          fetch(`/api/store/catalog?context=dashboard`)
        ]);

        if (libRes.ok) {
          const data = await libRes.json();
          setLibraryItems(data.items || []);
        }

        if (catalogRes.ok) {
          const data = await catalogRes.json();
          // ONLY textbooks for the dashboard library catalog
          setCatalogItems(data.books?.filter((b: any) => b._type === 'book') || []);
        }
      } catch (error) {
        console.error('Failed to fetch library data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.email]);

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const isTeacher = user.role === 'teacher' || user.role === 'instructor' || user.role === 'admin';

  const renderBookGrid = (books: BookSummary[], emptyMessage?: string) => {
    if (books.length === 0) {
      if (!emptyMessage) return null;
      return <p className="text-slate-400 italic text-sm">{emptyMessage}</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {books.map((book) => (
          <div key={book._id} className="scale-95 origin-top transition-transform hover:scale-100">
            <BookCard 
              book={book} 
              isDashboardContext={true} 
              user={{ role: user.role, email: user.email, username: user.username }} 
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Library & Resources</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your collection and explore official Hexadigitall textbooks.</p>
        </div>
      </div>

      {/* Library section wrapped with catalog toggle */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            My Collection ({libraryItems.length})
          </h3>
        </div>

        {libraryItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {libraryItems.map((item, index) => (
                <div key={index} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full border-b-4 border-b-blue-600/10 hover:border-b-blue-600">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {new Date(item.acquiredAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight font-serif">
                    {item.title}
                  </h3>
                  {item.slug && getReadingProgress(item.slug) && (
                    <p className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                      <ClockIcon className="h-3 w-3" />
                      Last read {formatTimeAgo(getReadingProgress(item.slug)!.timestamp)}
                    </p>
                  )}
                  <div className="mb-4" />
                  
                  <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                    {item.audience === 'teacher' && item.hasTeacherFile ? (() => {
                      const progress = item.slug ? getReadingProgress(item.slug) : null;
                      return (
                        <Link 
                          href={`/reader/${item.slug}`}
                          className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 dark:bg-blue-600 text-white hover:scale-[1.02] transition-all shadow-lg"
                        >
                          <span className="flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                            {progress ? <><ClockIcon className="h-4 w-4" /> Continue Reading</> : 'Open Reader'}
                          </span>
                          <BookOpenIcon className="h-5 w-5 shrink-0" />
                        </Link>
                      );
                    })() : (
                      item.files?.map((file: any, i: number) => (
                        <a 
                          key={i}
                          href={file.url}
                          target="_blank"
                          className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/30"
                        >
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate pr-4">{file.label || 'Download File'}</span>
                          <ArrowDownTrayIcon className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                        </a>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setShowCatalog(v => !v)}
                className={`text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all ${
                  showCatalog
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                }`}
              >
                {showCatalog ? 'Close Catalog' : 'Browse Catalog'}
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
              <BookmarkIcon className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-serif">Your library is currently empty</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg">
              You haven't acquired any textbooks or companion assets yet. Explore the catalog to get started.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowCatalog(v => !v)}
                className={`text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all ${
                  showCatalog
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                }`}
              >
                {showCatalog ? 'Close Catalog' : 'Browse Catalog'}
              </button>
            </div>
          </div>
        )}

        {/* Catalog content appears below, never replacing */}
        {showCatalog && (
          <div className="space-y-16 mt-16 pt-16 border-t border-slate-100 dark:border-slate-800">
            {/* Catalog Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                      type="text"
                      placeholder="Search catalog..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all text-sm font-medium"
                  />
               </div>
               <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                      <FunnelIcon className="h-4 w-4" />
                      <span>Level</span>
                  </div>
                  <select 
                      value={levelFilter}
                      onChange={(e) => setLevelFilter(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border-none rounded-2xl py-3 pl-4 pr-10 text-sm font-bold focus:ring-2 focus:ring-blue-600 transition-all"
                  >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                  </select>
               </div>
            </div>

            {/* Suggested Section */}
            {catalogSections.suggested.length > 0 && (
              <section>
                  <div className="flex items-center gap-4 mb-8">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 whitespace-nowrap">Suggested for You</h3>
                      <div className="h-px w-full bg-blue-600/10"></div>
                  </div>
                  {renderBookGrid(catalogSections.suggested)}
              </section>
            )}

            {/* Available Section */}
            <section>
               <div className="flex items-center gap-4 mb-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">Available Now</h3>
                  <div className="h-px w-full bg-slate-100 dark:bg-slate-800"></div>
              </div>
              {renderBookGrid(catalogSections.available, searchQuery || levelFilter !== 'all' ? "No books match your filters." : "No additional textbooks available at this time.")}
            </section>

            {/* Pipeline Section */}
            {catalogSections.pipeline.length > 0 && (
              <section>
                  <div className="flex items-center gap-4 mb-8">
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 whitespace-nowrap">In the Pipeline</h3>
                      <div className="h-px w-full bg-amber-500/10"></div>
                  </div>
                  {renderBookGrid(catalogSections.pipeline, "No upcoming textbooks in the pipeline.")}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
