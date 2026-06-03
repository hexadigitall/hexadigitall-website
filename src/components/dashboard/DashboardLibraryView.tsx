'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { BookmarkIcon, ArrowDownTrayIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import BookCard from '@/app/store/BookCard';
import { type BookSummary } from '@/lib/book-queries';

interface DashboardLibraryViewProps {
  user: {
    role: string;
    email: string;
    username?: string;
  };
  userCourses?: any[]; // Enrolled for students, assigned for teachers
}

export default function DashboardLibraryView({ user, userCourses = [] }: DashboardLibraryViewProps) {
  const [libraryItems, setLibraryItems] = useState<any[]>([]);
  const [catalogItems, setCatalogItems] = useState<BookSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'collection' | 'catalog'>('collection');

  // Logic for sectioning the catalog
  const catalogSections = useMemo(() => {
    if (catalogItems.length === 0) return { suggested: [], available: [], pipeline: [] };

    const userCourseIds = new Set(userCourses.map(c => c._id || c.course?._id).filter(Boolean));
    const userSchoolIds = new Set(userCourses.map(c => (c.school?._id || c.course?.school?._id)).filter(Boolean));
    
    // Suggested: Matching user courses OR matching school (supplementary)
    const suggested = catalogItems.filter(book => {
        const isDirectlyRelated = book.relatedCourse?._id && userCourseIds.has(book.relatedCourse._id);
        const isSupplementary = book.relatedCourse?.school?._id && userSchoolIds.has(book.relatedCourse.school._id);
        
        return book.status === 'available' && (isDirectlyRelated || isSupplementary);
    });

    // Available: Rest of available books
    const suggestedIds = new Set(suggested.map(b => b._id));
    const available = catalogItems.filter(book => {
        return book.status === 'available' && !suggestedIds.has(book._id);
    });

    // Pipeline: Coming soon
    const pipeline = catalogItems.filter(book => book.status === 'coming_soon');

    return { suggested, available, pipeline };
  }, [catalogItems, userCourses]);

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        const [libRes, catalogRes] = await Promise.all([
          fetch(`/api/student/library?email=${encodeURIComponent(user.email)}`),
          fetch(`/api/store/catalog`)
        ]);

        if (libRes.ok) {
          const data = await libRes.json();
          setLibraryItems(data.items || []);
        }

        if (catalogRes.ok) {
          const data = await catalogRes.json();
          // The API returns all books, but we double-check filtering here
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
      {/* Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Library & Resources</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your collection and explore official Hexadigitall textbooks.</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('collection')}
            className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
              activeTab === 'collection' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            My Collection ({libraryItems.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
              activeTab === 'catalog' 
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Official Catalog
          </button>
        </div>
      </div>

      {activeTab === 'collection' ? (
        <>
          {libraryItems.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-16 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8">
                <BookmarkIcon className="h-12 w-12 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 font-serif">Your library is currently empty</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-10 text-lg">
                You haven't acquired any textbooks or companion assets yet. Explore the catalog to get started.
              </p>
              <button 
                onClick={() => setActiveTab('catalog')}
                className="inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
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
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-4 flex-grow font-serif">
                    {item.title}
                  </h3>
                  
                  <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                    {item.files?.map((file: any, i: number) => (
                      <a 
                        key={i}
                        href={file.url}
                        target="_blank"
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900/30"
                      >
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate pr-4">{file.label || 'Download File'}</span>
                        <ArrowDownTrayIcon className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                      </a>
                    ))}

                    {item.type === 'Teacher Edition' && (
                      <Link 
                        href={`/store/${item.slug}/reader`}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 dark:bg-blue-600 text-white hover:scale-[1.02] transition-all shadow-lg"
                      >
                        <span className="text-sm font-black uppercase tracking-widest">Open Reader</span>
                        <BookOpenIcon className="h-5 w-5 shrink-0" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-16">
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
            {renderBookGrid(catalogSections.available, "No additional textbooks available at this time.")}
          </section>

          {/* Pipeline Section */}
          <section>
             <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 whitespace-nowrap">In the Pipeline</h3>
                <div className="h-px w-full bg-amber-500/10"></div>
            </div>
            {renderBookGrid(catalogSections.pipeline, "No upcoming textbooks in the pipeline.")}
          </section>
        </div>
      )}
    </div>
  );
}
