package ShanmingLiGroup.sprintboot_fullstack_project.student;

import ShanmingLiGroup.sprintboot_fullstack_project.student.exception.BadRequestException;
import ShanmingLiGroup.sprintboot_fullstack_project.student.exception.StudentNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service//so that we can use dependency injection to inject StudentService class in the controller
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public void addStudent(Student student) {
        // should check if the email is taken
        if (studentRepository.checkEmailTaken(student.getEmail())) {
            throw new BadRequestException("Email " + student.getEmail() + " has been taken");
        }

        studentRepository.save(student);
    }

    public void deleteStudent(Long studentId) {
        // should check if the student exists
        if (!studentRepository.existsById(studentId)) {
            throw new StudentNotFoundException("Student with id " + studentId + " does not exist");
        }
        studentRepository.deleteById(studentId);
    }
}
