export default function ArchiveNotice() {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="mr-3">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            نسخه آرشیوی
          </h3>
          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p>
              این صفحه یک نسخه آرشیوی از محتوای اصلی در سایت{' '}
              <a href="https://tajrobe.wiki" className="font-medium underline hover:text-yellow-800 dark:hover:text-yellow-100">
                tajrobe.wiki
              </a>
              {' '}است که به منظور حفظ تجربیات کاری نگهداری می‌شود.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 