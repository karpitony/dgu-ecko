import { CourseVodData} from '@/types/courseVodData';
import { getDday } from '@/libs/getDday';
import CourseItem from '@/components/common/CourseItem';
import { IoPlayOutline } from 'react-icons/io5';

export default function CourseList({
  courses,
  maxShow = 0
}: {
  courses: CourseVodData[];
  maxShow?: number;
}) {
  const vods = courses
    .flatMap((c) =>
      c.lectures.map((lec) => ({
        ...lec,
        courseTitle: c.courseTitle,
      })),
    )
    .filter((v) => getDday(v.period.end) >= 0)
    .sort((a, b) => getDday(a.period.end) - getDday(b.period.end));
  
  if (maxShow > 0) {
    vods.splice(maxShow);
  }

  if (vods.length === 0)
    return (
      <div className="text-sm text-gray-400">
        남은 VOD(사이버강의)가 없습니다 🎉
      </div>
    );

  return (
    <ul className="space-y-3 w-full">
      {vods.map((v) => (
        <CourseItem
          key={v.vodId ?? `${v.courseTitle}-${v.week}`}
          icon={
            <IoPlayOutline 
              className="text-2xl text-white p-1.5 pl-2 bg-[#8d8884] rounded-full w-12 h-12"
            />
          }
          title={v.title}
          courseTitle={v.courseTitle}
          due={v.period.end}
          completed={v.completed}
          onClick={() => {
            if (v.viewerUrl) window.open(v.viewerUrl, '_blank');
            else if (v.viewUrl) window.open(v.viewUrl, '_blank');
            else alert('아직 수업이 시작되지 않았거나, 강의 시청 URL이 제공되지 않았습니다.');
          }}
        />
      ))}
    </ul>
  );
}

