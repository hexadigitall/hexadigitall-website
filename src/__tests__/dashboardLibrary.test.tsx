import React from 'react';
import { render, screen } from '@testing-library/react';
import StoreCatalog from '@/app/store/StoreCatalog';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock BookCard and AuthorCard to simplify testing the catalog logic
jest.mock('@/app/store/BookCard', () => {
  return function MockBookCard({ book }: any) {
    return (
      <div data-testid={`book-card-${book._id}-${book._displayVariant || 'none'}`}>
        {book.title} ({book._displayVariant || 'none'})
      </div>
    );
  };
});

jest.mock('@/app/store/AuthorCard', () => {
  return function MockAuthorCard({ author }: any) {
    return <div data-testid={`author-card-${author._id}`}>{author.name}</div>;
  };
});

describe('StoreCatalog Dashboard Context', () => {
  const mockRouter = { replace: jest.fn() };
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/store');
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  const mockBooks = [
    {
      _id: 'book1',
      _type: 'book',
      title: 'Dual Edition Book',
      slug: { current: 'dual-edition' },
      status: 'available',
      hasTeacherVersion: true,
      hasStudentVersion: true,
    },
    {
      _id: 'book2',
      _type: 'book',
      title: 'Single Edition Book',
      slug: { current: 'single-edition' },
      status: 'available',
      hasTeacherVersion: false,
      hasStudentVersion: true,
    },
    {
      _id: 'imprint1',
      _type: 'imprint',
      title: 'Digital Imprint',
      slug: { current: 'imprint' },
      status: 'available',
    }
  ] as any;

  const mockAuthors = [] as any;

  it('shows both editions for teachers in dashboard context', () => {
    // Set context to dashboard
    const params = new URLSearchParams('context=dashboard');
    (useSearchParams as jest.Mock).mockReturnValue(params);

    const user = { role: 'teacher', email: 'teacher@test.com' };

    render(<StoreCatalog books={mockBooks} authors={mockAuthors} user={user} />);

    // Should see 2 cards for book1 (teacher and student variants)
    expect(screen.getByTestId('book-card-book1-teacher')).toBeInTheDocument();
    expect(screen.getByTestId('book-card-book1-student')).toBeInTheDocument();
    
    // Should see 1 card for book2 (single variant)
    expect(screen.getByTestId('book-card-book2-single')).toBeInTheDocument();
    
    // Should NOT see imprints
    expect(screen.queryByText(/Digital Imprint/)).not.toBeInTheDocument();
  });

  it('shows only student editions for students in dashboard context', () => {
    const params = new URLSearchParams('context=dashboard');
    (useSearchParams as jest.Mock).mockReturnValue(params);

    const user = { role: 'student', email: 'student@test.com' };

    render(<StoreCatalog books={mockBooks} authors={mockAuthors} user={user} />);

    // Should see only student variant for book1
    expect(screen.queryByTestId('book-card-book1-teacher')).not.toBeInTheDocument();
    expect(screen.getByTestId('book-card-book1-student')).toBeInTheDocument();
    
    // Should see student variant for book2
    expect(screen.getByTestId('book-card-book2-student')).toBeInTheDocument();

    // Should NOT see imprints
    expect(screen.queryByText(/Digital Imprint/)).not.toBeInTheDocument();
  });

  it('shows standard view (everything) outside dashboard context', () => {
    // Empty search params (standard view)
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    render(<StoreCatalog books={mockBooks} authors={mockAuthors} />);

    // Should see standard cards without display variants
    expect(screen.getByTestId('book-card-book1-none')).toBeInTheDocument();
    expect(screen.getByTestId('book-card-book2-none')).toBeInTheDocument();
    
    // Imprints are hidden from 'all' view by design in StoreCatalog (books.filter excludes non-books)
    // But they appear if type filter is 'imprint'. The 'all' view shows authors instead.
  });
});
